import { useQuery } from '@tanstack/react-query';

const API_BASE = 'https://countriesnow.space/api/v0.1';

export const useCountries = () => {
  // Use restcountries to also obtain calling code
  return useQuery({
    queryKey: ['location', 'countries'],
    queryFn: async () => {
      // Primary: restcountries v3
      // Build a static calling-code map to fill missing entries
      const staticMap = {
        AF: '+93', AL: '+355', DZ: '+213', AD: '+376', AO: '+244', AR: '+54', AM: '+374', AU: '+61', AT: '+43', AZ: '+994',
        BS: '+1', BH: '+973', BD: '+880', BY: '+375', BE: '+32', BZ: '+501', BJ: '+229', BT: '+975', BO: '+591', BA: '+387',
        BW: '+267', BR: '+55', BN: '+673', BG: '+359', BF: '+226', BI: '+257', KH: '+855', CM: '+237', CA: '+1', CV: '+238',
        CF: '+236', TD: '+235', CL: '+56', CN: '+86', CO: '+57', KM: '+269', CG: '+242', CR: '+506', HR: '+385', CU: '+53',
        CY: '+357', CZ: '+420', DK: '+45', DJ: '+253', DM: '+1', DO: '+1', EC: '+593', EG: '+20', SV: '+503', EE: '+372',
        ET: '+251', FJ: '+679', FI: '+358', FR: '+33', GA: '+241', GM: '+220', GE: '+995', DE: '+49', GH: '+233', GR: '+30',
        GD: '+1', GT: '+502', GN: '+224', GY: '+592', HT: '+509', HN: '+504', HU: '+36', IS: '+354', IN: '+91', ID: '+62',
        IR: '+98', IQ: '+964', IE: '+353', IL: '+972', IT: '+39', JM: '+1', JP: '+81', JO: '+962', KZ: '+7', KE: '+254',
        KW: '+965', KG: '+996', LA: '+856', LV: '+371', LB: '+961', LR: '+231', LY: '+218', LI: '+423', LT: '+370', LU: '+352',
        MG: '+261', MW: '+265', MY: '+60', MV: '+960', ML: '+223', MT: '+356', MU: '+230', MX: '+52', MD: '+373', MC: '+377',
        MN: '+976', ME: '+382', MA: '+212', MZ: '+258', MM: '+95', NA: '+264', NP: '+977', NL: '+31', NZ: '+64', NE: '+227',
        NG: '+234', NO: '+47', OM: '+968', PK: '+92', PA: '+507', PY: '+595', PE: '+51', PH: '+63', PL: '+48', PT: '+351',
        QA: '+974', RO: '+40', RU: '+7', RW: '+250', WS: '+685', SM: '+378', SA: '+966', SN: '+221', RS: '+381', SC: '+248',
        SG: '+65', SK: '+421', SI: '+386', SO: '+252', ZA: '+27', KR: '+82', ES: '+34', LK: '+94', SD: '+249', SE: '+46',
        CH: '+41', SY: '+963', TW: '+886', TJ: '+992', TZ: '+255', TH: '+66', TG: '+228', TO: '+676', TT: '+1', TN: '+216',
        TR: '+90', TM: '+993', UG: '+256', UA: '+380', AE: '+971', GB: '+44', US: '+1', UY: '+598', UZ: '+998', VU: '+678',
        VE: '+58', VN: '+84', YE: '+967', ZM: '+260', ZW: '+263'
      };

      try {
        const res = await fetch('https://restcountries.com/v3.1/all');
        if (!res.ok) throw new Error('restcountries failed');
        const json = await res.json();
        const mapped = json.map(c => {
          const name = c?.name?.common || c?.name || '';
          const code = (c?.cca2 || c?.alpha2Code || '').toUpperCase();
          const idd = c?.idd || {};
          let callingCode = '';
          if (idd?.root) {
            const suffix = (idd?.suffixes && idd.suffixes[0]) || '';
            callingCode = `${idd.root}${suffix}`;
          } else if (c?.callingCodes && c.callingCodes[0]) {
            callingCode = `+${c.callingCodes[0]}`;
          }
          if ((!callingCode || callingCode === '+') && code && staticMap[code]) {
            callingCode = staticMap[code];
          }
          if (callingCode && !callingCode.startsWith('+')) callingCode = `+${callingCode}`;
          return { name, code, callingCode };
        }).filter(Boolean).sort((a,b) => a.name.localeCompare(b.name));
        if (mapped && mapped.length) return mapped;
      } catch (err) {
        // continue to fallback
      }

      // Secondary: try countriesnow API as a fallback (may not have calling codes)
      try {
        const res2 = await fetch(`${API_BASE}/countries`);
        if (res2.ok) {
          const j2 = await res2.json();
          const list = (j2.data || []).map(item => ({
            name: item.country || item.name || item.country_name || '',
            code: (item.iso2 || item.iso3 || '').toUpperCase(),
            callingCode: staticMap[(item.iso2 || item.iso3 || '').toUpperCase()] || ''
          })).filter(Boolean).sort((a,b) => a.name.localeCompare(b.name));
          if (list && list.length > 50) return list;
        }
      } catch (err) {
        // continue to static fallback
      }

      // Final static fallback: expanded list to ensure UI has many countries
      return [
        { name: 'Afghanistan', code: 'AF', callingCode: '+93' },
        { name: 'Albania', code: 'AL', callingCode: '+355' },
        { name: 'Algeria', code: 'DZ', callingCode: '+213' },
        { name: 'Andorra', code: 'AD', callingCode: '+376' },
        { name: 'Angola', code: 'AO', callingCode: '+244' },
        { name: 'Argentina', code: 'AR', callingCode: '+54' },
        { name: 'Armenia', code: 'AM', callingCode: '+374' },
        { name: 'Australia', code: 'AU', callingCode: '+61' },
        { name: 'Austria', code: 'AT', callingCode: '+43' },
        { name: 'Azerbaijan', code: 'AZ', callingCode: '+994' },
        { name: 'Bahamas', code: 'BS', callingCode: '+1' },
        { name: 'Bahrain', code: 'BH', callingCode: '+973' },
        { name: 'Bangladesh', code: 'BD', callingCode: '+880' },
        { name: 'Belarus', code: 'BY', callingCode: '+375' },
        { name: 'Belgium', code: 'BE', callingCode: '+32' },
        { name: 'Belize', code: 'BZ', callingCode: '+501' },
        { name: 'Benin', code: 'BJ', callingCode: '+229' },
        { name: 'Bhutan', code: 'BT', callingCode: '+975' },
        { name: 'Bolivia', code: 'BO', callingCode: '+591' },
        { name: 'Bosnia and Herzegovina', code: 'BA', callingCode: '+387' },
        { name: 'Botswana', code: 'BW', callingCode: '+267' },
        { name: 'Brazil', code: 'BR', callingCode: '+55' },
        { name: 'Brunei', code: 'BN', callingCode: '+673' },
        { name: 'Bulgaria', code: 'BG', callingCode: '+359' },
        { name: 'Burkina Faso', code: 'BF', callingCode: '+226' },
        { name: 'Burundi', code: 'BI', callingCode: '+257' },
        { name: 'Cambodia', code: 'KH', callingCode: '+855' },
        { name: 'Cameroon', code: 'CM', callingCode: '+237' },
        { name: 'Canada', code: 'CA', callingCode: '+1' },
        { name: 'Cape Verde', code: 'CV', callingCode: '+238' },
        { name: 'Central African Republic', code: 'CF', callingCode: '+236' },
        { name: 'Chad', code: 'TD', callingCode: '+235' },
        { name: 'Chile', code: 'CL', callingCode: '+56' },
        { name: 'China', code: 'CN', callingCode: '+86' },
        { name: 'Colombia', code: 'CO', callingCode: '+57' },
        { name: 'Comoros', code: 'KM', callingCode: '+269' },
        { name: 'Congo', code: 'CG', callingCode: '+242' },
        { name: 'Costa Rica', code: 'CR', callingCode: '+506' },
        { name: 'Croatia', code: 'HR', callingCode: '+385' },
        { name: 'Cuba', code: 'CU', callingCode: '+53' },
        { name: 'Cyprus', code: 'CY', callingCode: '+357' },
        { name: 'Czech Republic', code: 'CZ', callingCode: '+420' },
        { name: 'Denmark', code: 'DK', callingCode: '+45' },
        { name: 'Djibouti', code: 'DJ', callingCode: '+253' },
        { name: 'Dominica', code: 'DM', callingCode: '+1' },
        { name: 'Dominican Republic', code: 'DO', callingCode: '+1' },
        { name: 'Ecuador', code: 'EC', callingCode: '+593' },
        { name: 'Egypt', code: 'EG', callingCode: '+20' },
        { name: 'El Salvador', code: 'SV', callingCode: '+503' },
        { name: 'Estonia', code: 'EE', callingCode: '+372' },
        { name: 'Ethiopia', code: 'ET', callingCode: '+251' },
        { name: 'Fiji', code: 'FJ', callingCode: '+679' },
        { name: 'Finland', code: 'FI', callingCode: '+358' },
        { name: 'France', code: 'FR', callingCode: '+33' },
        { name: 'Gabon', code: 'GA', callingCode: '+241' },
        { name: 'Gambia', code: 'GM', callingCode: '+220' },
        { name: 'Georgia', code: 'GE', callingCode: '+995' },
        { name: 'Germany', code: 'DE', callingCode: '+49' },
        { name: 'Ghana', code: 'GH', callingCode: '+233' },
        { name: 'Greece', code: 'GR', callingCode: '+30' },
        { name: 'Grenada', code: 'GD', callingCode: '+1' },
        { name: 'Guatemala', code: 'GT', callingCode: '+502' },
        { name: 'Guinea', code: 'GN', callingCode: '+224' },
        { name: 'Guyana', code: 'GY', callingCode: '+592' },
        { name: 'Haiti', code: 'HT', callingCode: '+509' },
        { name: 'Honduras', code: 'HN', callingCode: '+504' },
        { name: 'Hungary', code: 'HU', callingCode: '+36' },
        { name: 'Iceland', code: 'IS', callingCode: '+354' },
        { name: 'India', code: 'IN', callingCode: '+91' },
        { name: 'Indonesia', code: 'ID', callingCode: '+62' },
        { name: 'Iran', code: 'IR', callingCode: '+98' },
        { name: 'Iraq', code: 'IQ', callingCode: '+964' },
        { name: 'Ireland', code: 'IE', callingCode: '+353' },
        { name: 'Israel', code: 'IL', callingCode: '+972' },
        { name: 'Italy', code: 'IT', callingCode: '+39' },
        { name: 'Jamaica', code: 'JM', callingCode: '+1' },
        { name: 'Japan', code: 'JP', callingCode: '+81' },
        { name: 'Jordan', code: 'JO', callingCode: '+962' },
        { name: 'Kazakhstan', code: 'KZ', callingCode: '+7' },
        { name: 'Kenya', code: 'KE', callingCode: '+254' },
        { name: 'Kuwait', code: 'KW', callingCode: '+965' },
        { name: 'Kyrgyzstan', code: 'KG', callingCode: '+996' },
        { name: 'Laos', code: 'LA', callingCode: '+856' },
        { name: 'Latvia', code: 'LV', callingCode: '+371' },
        { name: 'Lebanon', code: 'LB', callingCode: '+961' },
        { name: 'Liberia', code: 'LR', callingCode: '+231' },
        { name: 'Libya', code: 'LY', callingCode: '+218' },
        { name: 'Liechtenstein', code: 'LI', callingCode: '+423' },
        { name: 'Lithuania', code: 'LT', callingCode: '+370' },
        { name: 'Luxembourg', code: 'LU', callingCode: '+352' },
        { name: 'Madagascar', code: 'MG', callingCode: '+261' },
        { name: 'Malawi', code: 'MW', callingCode: '+265' },
        { name: 'Malaysia', code: 'MY', callingCode: '+60' },
        { name: 'Maldives', code: 'MV', callingCode: '+960' },
        { name: 'Mali', code: 'ML', callingCode: '+223' },
        { name: 'Malta', code: 'MT', callingCode: '+356' },
        { name: 'Mauritius', code: 'MU', callingCode: '+230' },
        { name: 'Mexico', code: 'MX', callingCode: '+52' },
        { name: 'Moldova', code: 'MD', callingCode: '+373' },
        { name: 'Monaco', code: 'MC', callingCode: '+377' },
        { name: 'Mongolia', code: 'MN', callingCode: '+976' },
        { name: 'Montenegro', code: 'ME', callingCode: '+382' },
        { name: 'Morocco', code: 'MA', callingCode: '+212' },
        { name: 'Mozambique', code: 'MZ', callingCode: '+258' },
        { name: 'Myanmar', code: 'MM', callingCode: '+95' },
        { name: 'Namibia', code: 'NA', callingCode: '+264' },
        { name: 'Nepal', code: 'NP', callingCode: '+977' },
        { name: 'Netherlands', code: 'NL', callingCode: '+31' },
        { name: 'New Zealand', code: 'NZ', callingCode: '+64' },
        { name: 'Niger', code: 'NE', callingCode: '+227' },
        { name: 'Nigeria', code: 'NG', callingCode: '+234' },
        { name: 'Norway', code: 'NO', callingCode: '+47' },
        { name: 'Oman', code: 'OM', callingCode: '+968' },
        { name: 'Pakistan', code: 'PK', callingCode: '+92' },
        { name: 'Panama', code: 'PA', callingCode: '+507' },
        { name: 'Paraguay', code: 'PY', callingCode: '+595' },
        { name: 'Peru', code: 'PE', callingCode: '+51' },
        { name: 'Philippines', code: 'PH', callingCode: '+63' },
        { name: 'Poland', code: 'PL', callingCode: '+48' },
        { name: 'Portugal', code: 'PT', callingCode: '+351' },
        { name: 'Qatar', code: 'QA', callingCode: '+974' },
        { name: 'Romania', code: 'RO', callingCode: '+40' },
        { name: 'Russia', code: 'RU', callingCode: '+7' },
        { name: 'Rwanda', code: 'RW', callingCode: '+250' },
        { name: 'Samoa', code: 'WS', callingCode: '+685' },
        { name: 'San Marino', code: 'SM', callingCode: '+378' },
        { name: 'Saudi Arabia', code: 'SA', callingCode: '+966' },
        { name: 'Senegal', code: 'SN', callingCode: '+221' },
        { name: 'Serbia', code: 'RS', callingCode: '+381' },
        { name: 'Seychelles', code: 'SC', callingCode: '+248' },
        { name: 'Singapore', code: 'SG', callingCode: '+65' },
        { name: 'Slovakia', code: 'SK', callingCode: '+421' },
        { name: 'Slovenia', code: 'SI', callingCode: '+386' },
        { name: 'Somalia', code: 'SO', callingCode: '+252' },
        { name: 'South Africa', code: 'ZA', callingCode: '+27' },
        { name: 'South Korea', code: 'KR', callingCode: '+82' },
        { name: 'Spain', code: 'ES', callingCode: '+34' },
        { name: 'Sri Lanka', code: 'LK', callingCode: '+94' },
        { name: 'Sudan', code: 'SD', callingCode: '+249' },
        { name: 'Sweden', code: 'SE', callingCode: '+46' },
        { name: 'Switzerland', code: 'CH', callingCode: '+41' },
        { name: 'Syria', code: 'SY', callingCode: '+963' },
        { name: 'Taiwan', code: 'TW', callingCode: '+886' },
        { name: 'Tajikistan', code: 'TJ', callingCode: '+992' },
        { name: 'Tanzania', code: 'TZ', callingCode: '+255' },
        { name: 'Thailand', code: 'TH', callingCode: '+66' },
        { name: 'Togo', code: 'TG', callingCode: '+228' },
        { name: 'Tonga', code: 'TO', callingCode: '+676' },
        { name: 'Trinidad and Tobago', code: 'TT', callingCode: '+1' },
        { name: 'Tunisia', code: 'TN', callingCode: '+216' },
        { name: 'Turkey', code: 'TR', callingCode: '+90' },
        { name: 'Turkmenistan', code: 'TM', callingCode: '+993' },
        { name: 'Uganda', code: 'UG', callingCode: '+256' },
        { name: 'Ukraine', code: 'UA', callingCode: '+380' },
        { name: 'United Arab Emirates', code: 'AE', callingCode: '+971' },
        { name: 'United Kingdom', code: 'GB', callingCode: '+44' },
        { name: 'United States', code: 'US', callingCode: '+1' },
        { name: 'Uruguay', code: 'UY', callingCode: '+598' },
        { name: 'Uzbekistan', code: 'UZ', callingCode: '+998' },
        { name: 'Vanuatu', code: 'VU', callingCode: '+678' },
        { name: 'Venezuela', code: 'VE', callingCode: '+58' },
        { name: 'Vietnam', code: 'VN', callingCode: '+84' },
        { name: 'Yemen', code: 'YE', callingCode: '+967' },
        { name: 'Zambia', code: 'ZM', callingCode: '+260' },
        { name: 'Zimbabwe', code: 'ZW', callingCode: '+263' }
      ];
    },
    staleTime: 1000 * 60 * 60
  });
};

export const useStates = (country) => {
  return useQuery({
    queryKey: ['location', 'states', country],
    queryFn: async () => {
      if (!country) return [];
      try {
        const res = await fetch(`${API_BASE}/countries/states`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ country })
        });
        if (!res.ok) throw new Error('Network error');
        const json = await res.json();
        return (json.data?.states || []).map(s => s.name);
      } catch (err) {
        if (country === 'India') return ['Maharashtra', 'Karnataka', 'Delhi'];
        if (country === 'United States') return ['California', 'Texas', 'New York'];
        return [];
      }
    },
    enabled: !!country
  });
};

export const useCities = (country, state) => {
  return useQuery({
    queryKey: ['location', 'cities', country, state],
    queryFn: async () => {
      if (!country || !state) return [];
      try {
        const res = await fetch(`${API_BASE}/countries/state/cities`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ country, state })
        });
        if (!res.ok) throw new Error('Network error');
        const json = await res.json();
        return json.data || [];
      } catch (err) {
        if (country === 'India' && state === 'Maharashtra') return ['Mumbai', 'Pune', 'Nagpur'];
        if (country === 'India' && state === 'Karnataka') return ['Bengaluru', 'Mysore'];
        if (country === 'United States' && state === 'California') return ['Los Angeles', 'San Francisco'];
        return [];
      }
    },
    enabled: !!country && !!state
  });
};
