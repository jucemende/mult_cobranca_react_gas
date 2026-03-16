function doGet() {
  const template = HtmlService.createTemplateFromFile('frontend/index');
  return template
    .evaluate()
    .setTitle('MultCobranças')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(file, params = {}) {
  const tpl = HtmlService.createTemplateFromFile(file);
  Object.assign(tpl, params);
  return tpl.evaluate().getContent();
}

function segura(fn) {
  
  return function (...args) {
    try {

      const response = fn(...args);

      return {
        success: true,
        response
      };

    } catch (err) {
      
      return {
        success: false,
        message: err.message
      };

    }
  };
}

function fetchApp(request = {}) {
  return segura(app)(request)
}