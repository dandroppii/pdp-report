import { STORAGE_TOKEN_KEY } from 'constance/key-storage';
import { identityService } from './identity';

const list = [
  identityService,
  
];

const services = {
  setAuthToken: (token: string) => {
    list.forEach(service => service.setAuthToken(token));
  },
  clearAuthToken: () => {
    list.forEach(service => service.clearAuthToken());
  },
};
if(typeof window !== 'undefined') {
  const token = window?.localStorage?.getItem(STORAGE_TOKEN_KEY);
  if (token) {
    services.setAuthToken(token);
  }
  
  window?.addEventListener('storage', event => {
    const { key, newValue } = event;
    if (key === STORAGE_TOKEN_KEY && newValue) {
      services.setAuthToken(newValue);
    }
  });
}



export {
  identityService,
  services,
  
};
