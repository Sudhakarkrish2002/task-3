// Razorpay payment utility
import { paymentAPI } from './api.js';

/**
 * Initialize and process Razorpay payment
 * @param {Object} options - Payment options
 * @param {number} options.amount - Amount in rupees
 * @param {string} options.currency - Currency code (default: INR)
 * @param {Array} options.items - Array of items being purchased
 * @param {Object} options.billingAddress - Billing address object
 * @param {Object} options.metadata - Additional metadata
 * @param {Object} options.user - User details (name, email, contact)
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 */
export const processRazorpayPayment = async ({
  amount,
  currency = 'INR',
  items,
  billingAddress,
  metadata = {},
  user,
  onSuccess,
  onError,
}) => {
  try {
    // Check if Razorpay is loaded
    if (typeof window.Razorpay === 'undefined') {
      throw new Error('Razorpay SDK not loaded. Please refresh the page.');
    }

    // Step 1: Create order on backend
    const orderResponse = await paymentAPI.createOrder({
      amount,
      currency,
      items,
      billingAddress,
      metadata,
    });

    if (!orderResponse.success) {
      throw new Error(orderResponse.message || 'Failed to create order');
    }

    const { order, payment } = orderResponse.data;

    // Step 2: Initialize Razorpay checkout
    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'KiwisEdutech',
      description: items[0]?.itemName || 'Payment for services',
      order_id: order.id,
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },
      theme: {
        color: '#9333EA', // Primary color matching your brand
      },
      handler: async function (response) {
        try {
          // Step 3: Verify payment on backend
          const verifyResponse = await paymentAPI.verifyPayment({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });

          if (verifyResponse.success) {
            if (onSuccess) {
              onSuccess(verifyResponse.data);
            }
          } else {
            throw new Error(verifyResponse.message || 'Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          if (onError) {
            onError(error);
          } else {
            alert(`Payment verification failed: ${error.message}`);
          }
        }
      },
      modal: {
        ondismiss: function () {
          if (onError) {
            onError(new Error('Payment cancelled by user'));
          }
        },
      },
    };

    // Step 4: Open Razorpay checkout
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error('Razorpay payment error:', error);
    if (onError) {
      onError(error);
    } else {
      alert(`Payment error: ${error.message}`);
    }
  }
};

/**
 * Check if Razorpay is loaded
 */
export const isRazorpayLoaded = () => {
  return typeof window.Razorpay !== 'undefined';
};

/**
 * Load Razorpay script dynamically (if needed)
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (isRazorpayLoaded()) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });
};

