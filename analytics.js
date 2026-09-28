// Production analytics only; local previews never report.
(() => {
  if (!['promaxiptv.tv','www.promaxiptv.tv'].includes(location.hostname)) return;
  const id='G-P2GX0M5PNV';
  window.dataLayer=window.dataLayer||[];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag=gtag;
  gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  gtag('js',new Date());
  gtag('config',id,{allow_google_signals:false,allow_ad_personalization_signals:false,page_location:location.origin+location.pathname,cookie_expires:15552000});
  const script=document.createElement('script');
  script.async=true;
  script.src='https://www.googletagmanager.com/gtag/js?id='+id;
  document.head.append(script);
})();
