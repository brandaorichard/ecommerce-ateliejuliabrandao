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
      }],
      // Dimensões customizadas
      product_type: category,
      payment_method: 'mercado_pago'
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

// Visualização de lista de produtos
export const trackViewItemList = (items, listName) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item_list', {
      item_list_id: listName,
      item_list_name: listName,
      items: items
    });
  }
};

// Seleção de item da lista
export const trackSelectItem = (item, listName) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'select_item', {
      item_list_id: listName,
      item_list_name: listName,
      items: [item]
    });
  }
};

// Remoção do carrinho
export const trackRemoveFromCart = (itemId, itemName, category, quantity, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'remove_from_cart', {
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

// Visualização do carrinho
export const trackViewCart = (cartItems, totalValue) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_cart', {
      currency: 'BRL',
      value: totalValue,
      items: cartItems
    });
  }
};

// Melhorar trackPurchase com dados completos
export const trackPurchaseComplete = (order) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: order.id,
      value: order.total,
      currency: 'BRL',
      tax: 0,
      shipping: order.shipping || 0,
      items: order.items.map(item => ({
        item_id: item.slug || item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: item.quantity
      }))
    });
  }
};
