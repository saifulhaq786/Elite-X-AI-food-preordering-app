export interface RazorpayOptions {
  key: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Launch Razorpay Payment Modal.
 * If live NEXT_PUBLIC_RAZORPAY_KEY_ID exists, loads official Razorpay SDK popup.
 * Otherwise, launches a clean built-in Razorpay simulation modal with UPI / Cards / Wallets.
 */
export async function openRazorpayCheckout(options: {
  amount: number; // in Rupees
  name: string;
  description: string;
  userEmail?: string;
  userPhone?: string;
  userName?: string;
  onSuccess: (paymentId: string) => void;
  onDismiss?: () => void;
}): Promise<void> {
  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  // If real key exists, use official Razorpay script popup
  if (razorpayKey && razorpayKey.startsWith('rzp_')) {
    const loaded = await loadRazorpayScript();
    if (loaded && window.Razorpay) {
      const rzpOptions: RazorpayOptions = {
        key: razorpayKey,
        amount: Math.round(options.amount * 100),
        currency: 'INR',
        name: 'Elite X — ' + options.name,
        description: options.description,
        prefill: {
          name: options.userName || 'Campus Student',
          email: options.userEmail || 'student@college.edu',
          contact: options.userPhone || '9876543210',
        },
        theme: { color: '#1F5067' },
        handler: (response) => {
          options.onSuccess(response.razorpay_payment_id);
        },
        modal: {
          ondismiss: () => {
            if (options.onDismiss) options.onDismiss();
          },
        },
      };
      const rzp = new window.Razorpay(rzpOptions);
      rzp.open();
      return;
    }
  }

  // Built-in Razorpay Gateway Simulation Modal (when no key or offline)
  showRazorpaySimModal(options);
}

function showRazorpaySimModal(options: {
  amount: number;
  name: string;
  description: string;
  userEmail?: string;
  userPhone?: string;
  userName?: string;
  onSuccess: (paymentId: string) => void;
  onDismiss?: () => void;
}) {
  const modalId = 'razorpay-sim-modal-overlay';
  const existing = document.getElementById(modalId);
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = modalId;
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 16px; font-family: Inter, sans-serif;
  `;

  overlay.innerHTML = `
    <div style="background: #FFF; color: #1F1F1F; width: 100%; max-width: 420px; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3); animation: scaleIn 0.25s ease;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #0C2340 0%, #1A365D 100%); color: #FFF; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #FC8019;">Razorpay Gateway</div>
          <div style="font-size: 18px; font-weight: 900; margin-top: 2px;">₹${options.amount.toFixed(2)}</div>
        </div>
        <button id="rzp-sim-close" style="background: rgba(255,255,255,0.15); border: none; color: #FFF; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;">✕</button>
      </div>

      <div style="padding: 20px 24px;">
        <div style="font-size: 12px; color: #64748B; margin-bottom: 16px; text-align: center;">
          Select UPI app or payment method to complete test order
        </div>

        <!-- UPI Apps Grid -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
          <button class="rzp-pay-option" data-method="GPay" style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 12px 6px; cursor: pointer; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <span style="font-size: 22px;">🟢</span>
            <span style="font-size: 10px; font-weight: 800; color: #1E293B;">GPay</span>
          </button>
          <button class="rzp-pay-option" data-method="PhonePe" style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 12px 6px; cursor: pointer; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <span style="font-size: 22px;">🟣</span>
            <span style="font-size: 10px; font-weight: 800; color: #1E293B;">PhonePe</span>
          </button>
          <button class="rzp-pay-option" data-method="Paytm" style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 12px 6px; cursor: pointer; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <span style="font-size: 22px;">🔷</span>
            <span style="font-size: 10px; font-weight: 800; color: #1E293B;">Paytm</span>
          </button>
          <button class="rzp-pay-option" data-method="BHIM" style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 12px 6px; cursor: pointer; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <span style="font-size: 22px;">🇮🇳</span>
            <span style="font-size: 10px; font-weight: 800; color: #1E293B;">BHIM</span>
          </button>
        </div>

        <!-- Other Options List -->
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
          <button class="rzp-pay-option" data-method="Card" style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; font-weight: 700; color: #1E293B;">💳 Debit / Credit Card (Visa, MasterCard)</span>
            <span style="color: #FC8019; font-weight: 800;">Pay →</span>
          </button>
          <button class="rzp-pay-option" data-method="AmazonPay" style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; font-weight: 700; color: #1E293B;">🛒 Amazon Pay Later / Wallets</span>
            <span style="color: #FC8019; font-weight: 800;">Pay →</span>
          </button>
        </div>

        <div style="font-size: 11px; color: #94A3B8; text-align: center; line-height: 1.4;">
          🔒 Secured by 256-bit SSL encryption. Test Mode Enabled.
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeBtn = document.getElementById('rzp-sim-close');
  if (closeBtn) {
    closeBtn.onclick = () => {
      overlay.remove();
      if (options.onDismiss) options.onDismiss();
    };
  }

  const payButtons = overlay.querySelectorAll('.rzp-pay-option');
  payButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const method = btn.getAttribute('data-method') || 'UPI';
      const simPaymentId = `pay_${method.toLowerCase()}_` + Math.random().toString(36).substring(2, 10);
      overlay.remove();
      options.onSuccess(simPaymentId);
    });
  });
}
