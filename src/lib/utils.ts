export function getUrlParams() {
  const params:any = {};
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
      function (m, key, value) {
        return params[key] = value;
      }
  );
  return params;
}
