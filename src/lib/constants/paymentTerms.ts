export interface PaymentTimingOption {
  slug: string;
  label: string;
}

export interface PaymentMethodOption {
  slug: string;
  label: string;
}

/**
 * profiles.payment_timingに保存する値の一覧。
 * DBにはslugで保存し、表示名はここで一元管理する
 * (文言だけ直したい場合にマイグレーション不要にするため)。
 * 選択肢を追加する場合は、supabase/migrations側のcheck制約も更新すること。
 */
export const PAYMENT_TIMING_OPTIONS: PaymentTimingOption[] = [
  { slug: "prepay", label: "前払い" },
  { slug: "postpay", label: "後払い" },
  { slug: "negotiable", label: "応相談" },
];

/**
 * profiles.payment_methodsに保存する値の一覧。
 * how-it-worksページの支払い例示(PayPay/銀行振込/Wise/その他)に準拠。
 */
export const PAYMENT_METHOD_OPTIONS: PaymentMethodOption[] = [
  { slug: "paypay", label: "PayPay" },
  { slug: "bank_transfer", label: "銀行振込" },
  { slug: "line_pay", label: "LINE Pay" },
  { slug: "wise", label: "Wise(海外送金)" },
  { slug: "other", label: "その他/応相談" },
];

export function getPaymentTimingLabel(slug: string | null): string | null {
  if (!slug) {
    return null;
  }
  return PAYMENT_TIMING_OPTIONS.find((option) => option.slug === slug)?.label ?? slug;
}

export function getPaymentMethodLabel(slug: string): string {
  return PAYMENT_METHOD_OPTIONS.find((option) => option.slug === slug)?.label ?? slug;
}
