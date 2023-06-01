import { differenceInMinutes } from 'date-fns';
import ceil from 'lodash/ceil';

export const getDateDifference = (date: string | number | Date) => {
  let diff = differenceInMinutes(new Date(), new Date(date));
  if (diff < 60) return diff + ' minutes ago';

  diff = ceil(diff / 60);
  if (diff < 24) return `${diff} hour${diff === 0 ? '' : 's'} ago`;

  diff = ceil(diff / 24);
  if (diff < 30) return `${diff} day${diff === 0 ? '' : 's'} ago`;

  diff = ceil(diff / 30);
  if (diff < 12) return `${diff} month${diff === 0 ? '' : 's'} ago`;

  diff = diff / 12;
  return `${diff.toFixed(1)} year${ceil(diff) === 0 ? '' : 's'} ago`;
};

export const nonAccentVietnamese = (s: string) => {
  let str = s || '';
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  return str;
};

export function convertToSlug(text: string) {
  const noneVnText = nonAccentVietnamese(text);
  return `${noneVnText
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')}`;
}

export const searchString = (data: any[] = [], searchText: string, keySearch: string) => {
  const filterData = data.filter(i => {
    const s = nonAccentVietnamese(i[keySearch])
      ?.replace(/[^a-z0-9]/gi, ' ')
      ?.toLowerCase()
      ?.trim();

    return s.includes(searchText?.toLowerCase());
  });
  return filterData;
};
