// Usar gtag diretamente (já carregado no HTML)
// Inicializar GA4
export const initGA = (measurementId) => {
  if (measurementId && typeof window !== 'undefined') {
    console.log('Google Analytics 4 já inicializado via HTML:', measurementId);
  }
};

// Enviar pageview usando gtag
export const trackPageView = (path) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-HVR2YHYHKZ', {
      page_path: path,
    });
  }
};

// Eventos customizados usando gtag
export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};

// Eventos específicos do e-commerce
export const trackPurchase = (transactionId, value, currency = 'BRL', items = []) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items
    });
  }
};

export const trackAddToCart = (itemId, itemName, category, quantity, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'BRL',
      value: value,
      items: [{
        item_id: itemId,
        item_name: itemName,
        item_category: category,
        quantity: quantity,
        price: value
      }]
    });
  }
};

export const trackViewItem = (itemId, itemName, category, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'BRL',
      value: value,
      items: [{
        item_id: itemId,
        item_name: itemName,
        item_category: category,
        price: value
      }]
    });
  }
};

export const trackBeginCheckout = (value, items = []) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'BRL',
      value: value,
      items: items
    });
  }
};
