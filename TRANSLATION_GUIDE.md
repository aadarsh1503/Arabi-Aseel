# CustomerRegistration Translation Guide

## Summary
Added translation support for CustomerRegistration.jsx component.

## Translation Keys Added

### English (en/translation.json)
```json
"registration": {
  "exclusive_offer": "Exclusive Offer",
  "register_get_coupon": "Register now and get a BUY 1 GET 1 FREE or 50% DISCOUNT coupon",
  "limited_offer": "Limited to first 100 customers only!",
  // ... (all keys added)
}
```

### Arabic (ar/translation.json)
```json
"registration": {
  "exclusive_offer": "عرض حصري",
  "register_get_coupon": "سجل الآن واحصل على كوبون اشتر 1 واحصل على 1 مجاناً أو خصم 50%",
  "limited_offer": "محدود لأول 100 عميل فقط!",
  // ... (all keys added)
}
```

## Required Changes in CustomerRegistration.jsx

### 1. Import useTranslation (✅ DONE)
```javascript
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
```

### 2. Replace Static Text with Translation Keys

#### Header Section (Line ~500)
```jsx
// OLD:
<h1 className="text-3xl font-bold mb-2">Exclusive Offer</h1>
<p className="text-amber-100">Register now and get a BUY 1 GET 1 FREE or 50% DISCOUNT coupon</p>
<div className="mt-4 inline-block bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
  Limited to first 100 customers only!
</div>

// NEW:
<h1 className="text-3xl font-bold mb-2">{t('registration.exclusive_offer')}</h1>
<p className="text-amber-100">{t('registration.register_get_coupon')}</p>
<div className="mt-4 inline-block bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
  {t('registration.limited_offer')}
</div>
```

#### Form Labels (Line ~520-600)
```jsx
// Full Name
<label>{t('registration.full_name')}</label>
<input placeholder={t('registration.placeholder_name')} />

// Email
<label>{t('registration.email_address')}</label>
<input placeholder={t('registration.placeholder_email')} />

// Phone
<label>{t('registration.phone_number')}</label>

// Address Title
<label>{t('registration.address_title')}</label>
<input placeholder={t('registration.placeholder_address')} />

// Building Number
<label>{t('registration.building_number')}</label>
<input placeholder={t('registration.placeholder_building')} />

// City
<label>{t('registration.city')}</label>

// Postal Code
<label>{t('registration.postal_code')}</label>

// Buttons
<button>{t('registration.get_location')}</button>
<button>{loading ? t('registration.submitting') : t('registration.register_now')}</button>
```

#### Success Page (Line ~420-480)
```jsx
<h2>{t('registration.congratulations')}</h2>
<p>{t('registration.registration_complete')}</p>
<p>{t('registration.your_coupon_code')}</p>
<p>{couponData?.coupon_type === 'BUY_1_GET_1' ? t('registration.buy_1_get_1') : t('registration.discount_50')}</p>

<h3>{t('registration.how_to_use')}</h3>
<ol>
  <li>{t('registration.step_1')}</li>
  <li>{t('registration.step_2')}</li>
  <li>{t('registration.step_3')}</li>
</ol>
<p><strong>Note:</strong> {t('registration.one_time_use')}</p>
<p>{t('registration.terms_apply')}</p>
<button>{t('registration.back_to_home')}</button>
```

#### Not Eligible Page (Line ~280-340)
```jsx
<h2>{t('registration.not_eligible')}</h2>
<p>{t('registration.outside_service_area')}</p>
<p>{t('registration.eligible_service_areas')}</p>
<ul>
  <li>✓ {t('registration.north_sehla')} (شمال سهلة)</li>
  <li>✓ {t('registration.south_sehla')} (جنوب سهلة)</li>
  <li>✓ {t('registration.jidhafs')} (جدحفص)</li>
  <li>✓ {t('registration.jeblat_habshi')} (جبلة حبشي)</li>
  <li>✓ {t('registration.bu_quwah')} (بو قوة)</li>
  <li>✓ {t('registration.saraiya')} (السرايا)</li>
</ul>
<button>{t('registration.try_again')}</button>
<button>{t('registration.go_back_home')}</button>
<p>{t('registration.error_message')}</p>
```

#### Loading States
```jsx
// Location loading
{t('registration.requesting_location')}
{t('registration.verifying_location')}
{t('registration.location_verified')}
```

## Files Modified
1. ✅ `client/src/locales/en/translation.json` - Added registration keys
2. ✅ `client/src/locales/ar/translation.json` - Added Arabic translations
3. ✅ `client/src/components/Registration/CustomerRegistration.jsx` - Added useTranslation import
4. ⏳ `client/src/components/Registration/CustomerRegistration.jsx` - Need to replace all static text

## Next Steps
Replace all hardcoded English text in CustomerRegistration.jsx with `t('registration.key_name')` calls as shown above.

## Testing
1. Switch language using language toggle
2. Verify all text changes to Arabic
3. Check form labels, buttons, messages
4. Test success and error pages
