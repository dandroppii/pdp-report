/* eslint-disable no-await-in-loop */
const glob = require('glob');
const path = require('path');
const fs = require('node:fs/promises');
const fsExtra = require('fs-extra');
const flatten = require('flat');
const unflatten = require('flat').unflatten; // eslint-disable-line prefer-destructuring
const _ = require('lodash');
const chalk = require('chalk');
const { AsyncParser } = require('json2csv');

require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
require('dotenv').config();

const defaultLanguage = (process.env.LOCALE || 'vi') === 'vi' ? 'vi-VN' : 'en-US';
const verbose = process.env.VERBOSE === 'true';

const configs = {
  defaultLanguage,
  otherLanguages: ['en-US', 'vi-VN'].filter(lan => lan !== defaultLanguage),
  rootExportPath: './translations',
  defaultExportPath: './translations/{{locale}}/{{namespace}}.json',
  defaultCSVExportPath: './translations/all-translations.csv',
  defaultJSONExportPath: './translations/all.json',
  sharedNamespacesRegex: /common(-?)|core(-?)/,
};

const shortLang = {
  'vi-VN': 'vi',
  'en-US': 'en',
};

const allLocales = [];
const curSupportedLocales = [];
const curTranslations = {};
const curNamespaces = [];
const newTranslations = {};

function sortObjectByKeys(object) {
  const sortedObj = {};
  let keys = _.keys(object);

  keys = _.sortBy(keys, key => {
    return key;
  });

  _.each(keys, key => {
    if (typeof object[key] === 'object' && !(object[key] instanceof Array)) {
      sortedObj[key] = sortObjectByKeys(object[key]);
    } else {
      sortedObj[key] = object[key];
    }
  });

  return sortedObj;
}

function exportCSV() {
  const opts = {
    fields: ['key', ...allLocales],
  };

  const transformOpts = { highWaterMark: 8192 };
  const asyncParser = new AsyncParser(opts, transformOpts);

  const processJSON = translations => {
    const i18nKeys = Object.keys(flatten(translations[configs.defaultLanguage]));

    const newJSON = i18nKeys.reduce((allTrans, key) => {
      // Key is format common.seo_app_title
      const i18nValues = allLocales.reduce((obj, locale) => {
        obj[locale] = _.get(translations, [locale, key].join('.'), 'N/A');
        return obj;
      }, {});

      allTrans.push({
        key,
        ...i18nValues,
      });
      return allTrans;
    }, []);

    return newJSON;
  };

  let csv = '';
  asyncParser.processor
    .on('data', chunk => {
      csv += chunk.toString();
    })
    .on('end', () => {
      fs.writeFile(path.resolve(configs.defaultCSVExportPath), csv)
        .then(() => {
          console.log('✅  Exported translations CSV');
        })
        .catch(err => {
          console.log(chalk.red('Error writing CSV: ', err));
        });
    })
    .on('error', err => console.error(chalk.red('Error parsing CSV: ', err)));

  asyncParser.input.push(JSON.stringify(processJSON(newTranslations), null, 2));
  asyncParser.input.push(null);
}

async function joinAllTranslation() {
  for (const locale of allLocales) {
    const allTranslations = Object.values(newTranslations[locale]).reduce(
      (obj, item) => ({ ...obj, ...item }),
      {}
    );

    const destPath = getDestPath(locale, 'all');
    await fsExtra.outputJSON(destPath, allTranslations, {
      spaces: 2,
    });
  }
}

function getDestPath(locale, namespace) {
  let result = configs.defaultExportPath;
  result = result.replace('{{locale}}', locale);
  result = result.replace('{{namespace}}', namespace);
  return result;
}

function getPathTranslationFile(locale, namespace) {
  return path.resolve(getDestPath(locale, namespace));
}

function isKeyExistInTranslation(namespace, key) {
  const { defaultLanguage } = configs;

  if (curTranslations[defaultLanguage][namespace] == null) return false;

  return curTranslations[defaultLanguage][namespace][key] != null;
}

function getDuplicatedKeys(translationsItems) {
  const seen = new Set();
  const results = [];

  translationsItems.forEach(item => {
    let isDuplicated = false;
    // Check fully duplicated. Example: key1: 'namespace:xxx.yyy' ... key2: 'namespace:xxx.yyy'
    if (seen.size === seen.add(item.key).size) {
      isDuplicated = true;
    } else {
      // Check partly duplicated. Example: key1: 'namespace:xxx.yyy' ... key2: 'namespace:xxx.yyy.zzz'
      translationsItems.forEach(otherItem => {
        if (item.key !== otherItem.key && otherItem.key.includes(item.key.concat('.')))
          isDuplicated = true;
      });

      if (isDuplicated) results.push(item.key);
    }
  });

  return results;
}

function addNamespaceToTranslation(namespace) {
  allLocales.forEach(locale => {
    newTranslations[locale][namespace] = {};
  });
}

async function deleteTranslationFile(namespace) {
  const promises = [];
  for (let i = 0; i < allLocales.length; i++) {
    const locale = allLocales[i];
    promises.push(fsExtra.remove(getPathTranslationFile(locale, namespace)));
  }
  await Promise.allSettled(promises);
}

async function importTranslationFiles(locale) {
  const files = glob.sync(`./translations/**/${locale}/*.json`);

  if (files.length > 0) {
    curSupportedLocales.push(locale);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const fullPath = path.resolve(file);
      const namespace = path.basename(fullPath, '.json');

      const data = await fsExtra.readJSON(fullPath);

      if (!curNamespaces.includes(namespace)) curNamespaces.push(namespace);
      curTranslations[locale][namespace] = flatten(data);
    }
  } else {
    console.log(`🆕   Detected new locale: ${locale}`);
  }
}

function processSyncTranslations() {
  const allTranslationFiles = glob.sync('./src/**/?(*.)translations.json');

  console.log('➡️➡️➡️  Processing...');

  allLocales.forEach(locale => {
    newTranslations[locale] = {};
    curNamespaces.forEach(namespace => {
      newTranslations[locale][namespace] = {};
    });
  });

  for (let i = 0; i < allTranslationFiles.length; i++) {
    const translationPath = path.resolve(allTranslationFiles[i]);
    const translation = require(translationPath); // eslint-disable-line

    if (!translation) {
      return console.error(
        chalk.red(`❎  Incorrect translation file!`, `\n=> Location: ${translationPath}\n`)
      );
    }

    const translationItems = Object.values(translation).filter(
      trans => trans !== null && _.isObject(trans)
    );

    const duplicatedKeys = getDuplicatedKeys(translationItems);
    if (duplicatedKeys.length > 0) {
      duplicatedKeys.forEach(key => {
        console.error(
          chalk.red(
            `❎  Duplicated key ${chalk.yellow(`${key}`)}`,
            `\n=> Location: ${translationPath}\n`
          )
        );
      });

      process.exit(1);
    }

    // Item shape: { key, messages: { vi: '...', en: '...' } }
    translationItems.forEach(item => {
      if ((item.key.match(/:/g) || []).length !== 1) {
        console.error(
          chalk.red(
            `❎  Missing or duplicated namespace separator ':' in key ${chalk.yellow(
              `${item.key}`
            )}`,
            `\n=> Location: ${translationPath}\n`
          )
        );

        process.exit(1);
      }

      if (item.messages == null) {
        console.error(
          chalk.red(
            `❎  Missing 'message' in key ${chalk.yellow(`${item.key}`)}`,
            `\n=> Location: ${translationPath}\n`
          )
        );

        process.exit(1);
      }

      const [namespace, i18nKey] = item.key.split(':');

      if (!curNamespaces.includes(namespace)) {
        curNamespaces.push(namespace);
        addNamespaceToTranslation(namespace);
        console.log(`✅  Created new namespace: ${namespace}`);
      }

      allLocales.forEach(locale => {
        if (isKeyExistInTranslation(namespace, i18nKey)) {
          if (!curSupportedLocales.includes(locale)) {
            newTranslations[locale][namespace][i18nKey] =
              curTranslations[configs.defaultLanguage][namespace][i18nKey];
          } else {
            const localeMessage = item.messages[shortLang[locale]];

            if (
              locale === configs.defaultLanguage &&
              localeMessage !== curTranslations[locale][namespace][i18nKey]
            ) {
              console.warn(
                `⚠️  Should update default message`,
                chalk.yellow(`${i18nKey}`),
                `=>`,
                chalk.blue(`${curTranslations[locale][namespace][i18nKey]}`),
                `\n=> Location: ${translationPath}\n`
              );
            }
            newTranslations[locale][namespace][i18nKey] =
              curTranslations[locale][namespace][i18nKey];
          }
        } else {
          const localeMessage = item.messages[shortLang[locale]];
          newTranslations[locale][namespace][i18nKey] = localeMessage;

          if (locale === configs.defaultLanguage && verbose) {
            console.log(`✅  Added key [${i18nKey}] to namespace [${namespace}]`);
          }
        }
      });
    });
  }
}

async function exportTranslationsFiles(locale) {
  try {
    const namespaces = Object.keys(newTranslations[locale]);
    for (let i = 0; i < namespaces.length; i++) {
      const outputPath = getPathTranslationFile(locale, namespaces[i]);
      const unflattenNS = unflatten(newTranslations[locale][namespaces[i]]);
      const sortedAlphabeNS = sortObjectByKeys(unflattenNS);

      console.log(chalk.blue(`Exporting translation file ${outputPath}`));

      await fsExtra.outputJSON(outputPath, sortedAlphabeNS, {
        spaces: 2,
      });
    }
  } catch (err) {
    console.error(err);
  }
}

async function importAllTranslationFiles() {
  for (let i = 0; i < allLocales.length; i++) {
    const locale = allLocales[i];
    curTranslations[locale] = {};
    await importTranslationFiles(locale);
  }
  console.log(`🌐  Current supported locales: ${curSupportedLocales}`);
  console.log(`✅  Imported translation files success!`);
}

async function exportAllTranslationFiles() {
  for (let i = 0; i < allLocales.length; i++) {
    const locale = allLocales[i];
    await exportTranslationsFiles(locale);
  }
  console.log(`✅  Exported translation JSON files`);
}

async function deleteAllUnusedTranslationFiles() {
  const namespaces = Object.keys(newTranslations[configs.defaultLanguage]);
  for (let i = 0; i < namespaces.length; i++) {
    const namespace = namespaces[i];
    const { defaultLanguage } = configs;
    const values = Object.values(newTranslations[defaultLanguage][namespace]);
    if (values.length === 0) {
      await deleteTranslationFile(namespace);
      console.log(`✅  Deleted unused namespace: ${namespace}`);
    }
  }
}

async function rimraf(dir) {
  return fsExtra.emptyDir(dir);
}

function init() {
  allLocales.push(configs.defaultLanguage);
  for (const otherLang of configs.otherLanguages) {
    allLocales.push(otherLang);
  }
}

try {
  init();
  rimraf(path.resolve(configs.rootExportPath))
    .then(() => {
      return importAllTranslationFiles();
    })
    .then(() => {
      processSyncTranslations();
      exportAllTranslationFiles().then(() => {
        deleteAllUnusedTranslationFiles();

        joinAllTranslation();

        const shouldExport = process.env.EXPORT_CSV === 'true';
        if (shouldExport) {
          exportCSV();
        }
      });
    });
} catch (err) {
  console.error(chalk.red(`❎  Run translation failed!`), err);
}
/* eslint-enable no-await-in-loop */
