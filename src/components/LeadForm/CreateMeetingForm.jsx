import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { getMeetingSettingList, getUserFromHashedList } from '../../utils/lead';
import { getSession } from '../../getSession';

const CreateMeetingForm = ({ lead }) => {
  const [meetingTemplate, setMeetingTemplate] = useState('');
  const [meetingName, setMeetingName] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const startRef = useRef(null);
  const endRef = useRef(null);
  const repeatEndRef = useRef(null);

  const formatToDisplay = (val) => {
    if (!val) return '';
    // expect input like 'YYYY-MM-DDTHH:mm'
    const [datePart, timePart] = String(val).split('T');
    if (!datePart) return val;
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour = '00', minute = '00'] = (timePart || '').split(':');
    if (!year || !month || !day) return val;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const display = `${String(day).padStart(2,'0')}-${months[month-1]}-${year} ${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`;
    return display;
  };

  const openPicker = (ref) => {
    try {
      if (!ref || !ref.current) return;
      const el = ref.current;
      if (typeof el.showPicker === 'function') {
        el.showPicker();
      } else {
        el.focus();
        el.click();
      }
    } catch (e) {
      // ignore
    }
  };
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [isRecurring, setIsRecurring] = useState(false);
  const [repeatType, setRepeatType] = useState('');
  const [repeatEvery, setRepeatEvery] = useState(1);
  const [repeatUnit, setRepeatUnit] = useState('Days');
  const [repeatEndsType, setRepeatEndsType] = useState('onDate'); // 'onDate' or 'after'
  const [repeatEndDate, setRepeatEndDate] = useState('');
  const [repeatAfterCount, setRepeatAfterCount] = useState(1);
  const [host, setHost] = useState('Abhi01');
  const [addCoHost, setAddCoHost] = useState(false);
  const [coHostQuery, setCoHostQuery] = useState('');
  const [coHosts, setCoHosts] = useState([]);
  const [showCoHostSuggestions, setShowCoHostSuggestions] = useState(false);
  const [participants, setParticipants] = useState('');

  const deriveParticipantFromLead = (l) => {
    if (!l) return '';
    return l.PersonName ?? l.personName ?? l.Person ?? l.Name ?? l.FullName ?? l.LeadName ?? l.CustomerName ?? l.DisplayName ?? l.Text ?? '';
  };

  const leadParticipantName = deriveParticipantFromLead(lead);

  useEffect(() => {
    if (leadParticipantName) setParticipants(leadParticipantName);
  }, [leadParticipantName]);

  const fallbackTemplates = [
    'Sales Meeting Template',
    'Follow-up Meeting Template',
    'Demo Meeting Template',
    'Client Meeting Template'
  ];

  const [templates, setTemplates] = useState(fallbackTemplates);

  useEffect(() => {
    let mounted = true;
    const fetchSettings = async () => {
      try {
       const { TokenId, userId, parentId } = getSession();
        const payload = {
          Token: TokenId,
          Message: "",
          LoggedUserId: userId,
          MAC_Address: "",
          IP_Address: "",
          Details: { ismeeting: "", userId: userId }
        };
        const resp = await getMeetingSettingList(payload);
        const list = resp?.Details || resp || [];
        const normalize = (item) => {
          if (!item) return '';
          if (typeof item === 'string') return item;
          return item.MeetingSettingName || item.Name || item.MeetingName || item.Title || item.Text || item.SettingName || item.DisplayName || JSON.stringify(item);
        };
        if (mounted && Array.isArray(list) && list.length) {
          setTemplates(list.map(normalize));
        }
      } catch (err) {
        // keep fallback templates on error
        console.warn('Failed to load meeting settings:', err?.message || err);
      }
    };
    fetchSettings();
    return () => { mounted = false };
  }, []);

  const fallbackHosts = [
    { value: 'Abhi01', label: 'Abhi01' },
    { value: 'Sales Team', label: 'Sales Team' },
    { value: 'Marketing Team', label: 'Marketing Team' },
    { value: 'Support Team', label: 'Support Team' }
  ];

  const [hosts, setHosts] = useState(fallbackHosts);
  const [isUsersLoading, setIsUsersLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      setIsUsersLoading(true);
      try {
        const { userId, TokenId } = getSession();
        const details = { UserId: userId || 0 };
        const payload = {
          Token: TokenId,
          Message: '',
          LoggedUserId: userId,
          MAC_Address: '',
          IP_Address: '',
          Details: details,
          BroadcastName: ''
        };
        const resp = await getUserFromHashedList(payload);
        let raw = resp?.Details ?? resp?.d ?? resp ?? [];
        if (raw && raw.data) raw = raw.data;
        if (raw && !Array.isArray(raw)) {
          raw = raw.ResultList ?? raw.Users ?? raw.UserList ?? raw.Data ?? raw.Items ?? raw;
        }
        const usersArray = Array.isArray(raw) ? raw : [];
        const mapToOption = (u) => {
          const id = u.Code ?? u.Id ?? u.ID ?? u.UserId ?? u.Value ?? u.ValueId ?? '';
          const label = u.Text ?? u.TextN ?? u.Name ?? u.FullName ?? u.DisplayName ?? u.LoginName ?? String(id);
          return { value: String(id), label: String(label) };
        };
        if (mounted) {
          const options = usersArray.map(mapToOption);
          if (options.length) setHosts(options);
        }
      } catch (error) {
        console.error('fetch users error:', error);
      } finally {
        if (mounted) setIsUsersLoading(false);
      }
    };
    fetchUsers();
    return () => { mounted = false };
  }, []);

  // Sample users for co-host suggestions (id-name format used in UI)
  const users = [
    '34594-Mohit.cheema',
    '34594-Manish.Singh',
    '34594-Rachit.Kumar',
    '34594-Perumal.R',
    '34594-kmukesh343'
  ];

  const timezones = [
    { value: 'Etc/GMT+12', label: '( GMT -12:00 ) GMT-12:00 (Etc/GMT+12)' },
    { value: 'Pacific/Niue', label: '( GMT -11:00 ) Niue Time (Pacific/Niue)' },
    { value: 'Pacific/Pago_Pago', label: '( GMT -11:00 ) Samoa Standard Time (Pacific/Pago_Pago)' },
    { value: 'Pacific/Honolulu', label: '( GMT -10:00 ) Hawaii Standard Time (Pacific/Honolulu)' },
    { value: 'Pacific/Rarotonga', label: '( GMT -10:00 ) Cook Is. Time (Pacific/Rarotonga)' },
    { value: 'Pacific/Tahiti', label: '( GMT -10:00 ) Tahiti Time (Pacific/Tahiti)' },
    { value: 'Pacific/Marquesas', label: '( GMT -9:30 ) Marquesas Time (Pacific/Marquesas)' },
    { value: 'America/Adak', label: '( GMT -9:00 ) Hawaii Daylight Time (America/Adak)' },
    { value: 'Pacific/Gambier', label: '( GMT -9:00 ) Gambier Time (Pacific/Gambier)' },
    { value: 'America/Anchorage', label: '( GMT -8:00 ) Alaska Daylight Time (America/Anchorage)' },
    { value: 'America/Juneau', label: '( GMT -8:00 ) Alaska Daylight Time (America/Juneau)' },
    { value: 'America/Metlakatla', label: '( GMT -8:00 ) Alaska Daylight Time (America/Metlakatla)' },
    { value: 'America/Nome', label: '( GMT -8:00 ) Alaska Daylight Time (America/Nome)' },
    { value: 'America/Sitka', label: '( GMT -8:00 ) Alaska Daylight Time (America/Sitka)' },
    { value: 'America/Yakutat', label: '( GMT -8:00 ) Alaska Daylight Time (America/Yakutat)' },
    { value: 'Pacific/Pitcairn', label: '( GMT -8:00 ) Pitcairn Standard Time (Pacific/Pitcairn)' },
    { value: 'America/Dawson', label: '( GMT -7:00 ) Mountain Standard Time (America/Dawson)' },
    { value: 'America/Dawson_Creek', label: '( GMT -7:00 ) Mountain Standard Time (America/Dawson_Creek)' },
    { value: 'America/Fort_Nelson', label: '( GMT -7:00 ) Mountain Standard Time (America/Fort_Nelson)' },
    { value: 'America/Hermosillo', label: '( GMT -7:00 ) Mountain Standard Time (America/Hermosillo)' },
    { value: 'America/Los_Angeles', label: '( GMT -7:00 ) Pacific Daylight Time (America/Los_Angeles)' },
    { value: 'America/Mazatlan', label: '( GMT -7:00 ) Mountain Daylight Time (America/Mazatlan)' },
    { value: 'America/Phoenix', label: '( GMT -7:00 ) Mountain Standard Time (America/Phoenix)' },
    { value: 'America/Tijuana', label: '( GMT -7:00 ) Pacific Daylight Time (America/Tijuana)' },
    { value: 'America/Vancouver', label: '( GMT -7:00 ) Pacific Daylight Time (America/Vancouver)' },
    { value: 'America/Whitehorse', label: '( GMT -7:00 ) Mountain Standard Time (America/Whitehorse)' },
    { value: 'MST', label: '( GMT -7:00 ) Mountain Standard Time (MST)' },
    { value: 'America/Bahia_Banderas', label: '( GMT -6:00 ) Central Standard Time (America/Bahia_Banderas)' },
    { value: 'America/Belize', label: '( GMT -6:00 ) Central Standard Time (America/Belize)' },
    { value: 'America/Boise', label: '( GMT -6:00 ) Mountain Daylight Time (America/Boise)' },
    { value: 'America/Cambridge_Bay', label: '( GMT -6:00 ) Mountain Daylight Time (America/Cambridge_Bay)' },
    { value: 'America/Chihuahua', label: '( GMT -6:00 ) Mountain Daylight Time (America/Chihuahua)' },
    { value: 'America/Costa_Rica', label: '( GMT -6:00 ) Central Standard Time (America/Costa_Rica)' },
    { value: 'America/Denver', label: '( GMT -6:00 ) Mountain Daylight Time (America/Denver)' },
    { value: 'America/Edmonton', label: '( GMT -6:00 ) Mountain Daylight Time (America/Edmonton)' },
    { value: 'America/El_Salvador', label: '( GMT -6:00 ) Central Standard Time (America/El_Salvador)' },
    { value: 'America/Guatemala', label: '( GMT -6:00 ) Central Standard Time (America/Guatemala)' },
    { value: 'America/Inuvik', label: '( GMT -6:00 ) Mountain Daylight Time (America/Inuvik)' },
    { value: 'America/Managua', label: '( GMT -6:00 ) Central Standard Time (America/Managua)' },
    { value: 'America/Merida', label: '( GMT -6:00 ) Central Daylight Time (America/Merida)' },
    { value: 'America/Mexico_City', label: '( GMT -6:00 ) Central Daylight Time (America/Mexico_City)' },
    { value: 'America/Monterrey', label: '( GMT -6:00 ) Central Daylight Time (America/Monterrey)' },
    { value: 'America/Ojinaga', label: '( GMT -6:00 ) Mountain Standard Time (America/Ojinaga)' },
    { value: 'America/Regina', label: '( GMT -6:00 ) Central Standard Time (America/Regina)' },
    { value: 'America/Swift_Current', label: '( GMT -6:00 ) Central Standard Time (America/Swift_Current)' },
    { value: 'America/Tegucigalpa', label: '( GMT -6:00 ) Central Standard Time (America/Tegucigalpa)' },
    { value: 'Pacific/Galapagos', label: '( GMT -6:00 ) Galapagos Time (Pacific/Galapagos)' },
    { value: 'America/Bogota', label: '( GMT -5:00 ) Colombia Time (America/Bogota)' },
    { value: 'America/Cancun', label: '( GMT -5:00 ) Eastern Standard Time (America/Cancun)' },
    { value: 'America/Chicago', label: '( GMT -5:00 ) Central Daylight Time (America/Chicago)' },
    { value: 'America/Eirunepe', label: '( GMT -5:00 ) Acre Time (America/Eirunepe)' },
    { value: 'America/Guayaquil', label: '( GMT -5:00 ) Ecuador Time (America/Guayaquil)' },
    { value: 'America/Indiana/Knox', label: '( GMT -5:00 ) Central Daylight Time (America/Indiana/Knox)' },
    { value: 'America/Indiana/Tell_City', label: '( GMT -5:00 ) Central Daylight Time (America/Indiana/Tell_City)' },
    { value: 'America/Jamaica', label: '( GMT -5:00 ) Eastern Standard Time (America/Jamaica)' },
    { value: 'America/Lima', label: '( GMT -5:00 ) Peru Time (America/Lima)' },
    { value: 'America/Matamoros', label: '( GMT -5:00 ) Central Daylight Time (America/Matamoros)' },
    { value: 'America/Menominee', label: '( GMT -5:00 ) Central Daylight Time (America/Menominee)' },
    { value: 'America/North_Dakota/Beulah', label: '( GMT -5:00 ) Central Daylight Time (America/North_Dakota/Beulah)' },
    { value: 'America/North_Dakota/Center', label: '( GMT -5:00 ) Central Daylight Time (America/North_Dakota/Center)' },
    { value: 'America/North_Dakota/New_Salem', label: '( GMT -5:00 ) Central Daylight Time (America/North_Dakota/New_Salem)' },
    { value: 'America/Panama', label: '( GMT -5:00 ) Eastern Standard Time (America/Panama)' },
    { value: 'America/Rankin_Inlet', label: '( GMT -5:00 ) Central Daylight Time (America/Rankin_Inlet)' },
    { value: 'America/Resolute', label: '( GMT -5:00 ) Central Daylight Time (America/Resolute)' },
    { value: 'America/Rio_Branco', label: '( GMT -5:00 ) Acre Time (America/Rio_Branco)' },
    { value: 'America/Winnipeg', label: '( GMT -5:00 ) Central Daylight Time (America/Winnipeg)' },
    { value: 'CST6CDT', label: '( GMT -5:00 ) Central Daylight Time (CST6CDT)' },
    { value: 'Pacific/Easter', label: '( GMT -5:00 ) Easter Is. Time (Pacific/Easter)' },
    { value: 'America/Barbados', label: '( GMT -4:00 ) Atlantic Standard Time (America/Barbados)' },
    { value: 'America/Boa_Vista', label: '( GMT -4:00 ) Amazon Time (America/Boa_Vista)' },
    { value: 'America/Campo_Grande', label: '( GMT -4:00 ) Amazon Time (America/Campo_Grande)' },
    { value: 'America/Caracas', label: '( GMT -4:00 ) Venezuela Time (America/Caracas)' },
    { value: 'America/Cuiaba', label: '( GMT -4:00 ) Amazon Time (America/Cuiaba)' },
    { value: 'America/Detroit', label: '( GMT -4:00 ) Eastern Daylight Time (America/Detroit)' },
    { value: 'America/Grand_Turk', label: '( GMT -4:00 ) Eastern Daylight Time (America/Grand_Turk)' },
    { value: 'America/Guyana', label: '( GMT -4:00 ) Guyana Time (America/Guyana)' },
    { value: 'America/Havana', label: '( GMT -4:00 ) Cuba Daylight Time (America/Havana)' },
    { value: 'America/Indiana/Indianapolis', label: '( GMT -4:00 ) Eastern Daylight Time (America/Indiana/Indianapolis)' },
    { value: 'America/Indiana/Marengo', label: '( GMT -4:00 ) Eastern Daylight Time (America/Indiana/Marengo)' },
    { value: 'America/Indiana/Petersburg', label: '( GMT -4:00 ) Eastern Daylight Time (America/Indiana/Petersburg)' },
    { value: 'America/Indiana/Vevay', label: '( GMT -4:00 ) Eastern Daylight Time (America/Indiana/Vevay)' },
    { value: 'America/Indiana/Vincennes', label: '( GMT -4:00 ) Eastern Daylight Time (America/Indiana/Vincennes)' },
    { value: 'America/Indiana/Winamac', label: '( GMT -4:00 ) Eastern Daylight Time (America/Indiana/Winamac)' },
    { value: 'America/Iqaluit', label: '( GMT -4:00 ) Eastern Daylight Time (America/Iqaluit)' },
    { value: 'America/Kentucky/Louisville', label: '( GMT -4:00 ) Eastern Daylight Time (America/Kentucky/Louisville)' },
    { value: 'America/Kentucky/Monticello', label: '( GMT -4:00 ) Eastern Daylight Time (America/Kentucky/Monticello)' },
    { value: 'America/La_Paz', label: '( GMT -4:00 ) Bolivia Time (America/La_Paz)' },
    { value: 'America/Manaus', label: '( GMT -4:00 ) Amazon Time (America/Manaus)' },
    { value: 'America/Martinique', label: '( GMT -4:00 ) Atlantic Standard Time (America/Martinique)' },
    { value: 'America/New_York', label: '( GMT -4:00 ) Eastern Daylight Time (America/New_York)' },
    { value: 'America/Port-au-Prince', label: '( GMT -4:00 ) Eastern Daylight Time (America/Port-au-Prince)' },
    { value: 'America/Porto_Velho', label: '( GMT -4:00 ) Amazon Time (America/Porto_Velho)' },
    { value: 'America/Puerto_Rico', label: '( GMT -4:00 ) Atlantic Standard Time (America/Puerto_Rico)' },
    { value: 'America/Santo_Domingo', label: '( GMT -4:00 ) Atlantic Standard Time (America/Santo_Domingo)' },
    { value: 'America/Toronto', label: '( GMT -4:00 ) Eastern Daylight Time (America/Toronto)' },
    { value: 'America/Araguaina', label: '( GMT -3:00 ) Brasilia Time (America/Araguaina)' },
    { value: 'America/Argentina/Buenos_Aires', label: '( GMT -3:00 ) Argentine Time (America/Argentina/Buenos_Aires)' },
    { value: 'America/Argentina/Catamarca', label: '( GMT -3:00 ) Argentine Time (America/Argentina/Catamarca)' },
    { value: 'America/Argentina/Cordoba', label: '( GMT -3:00 ) Argentine Time (America/Argentina/Cordoba)' },
    { value: 'America/Argentina/Jujuy', label: '( GMT -3:00 ) Argentine Time (America/Argentina/Jujuy)' },
    { value: 'America/Argentina/La_Rioja', label: '( GMT -3:00 ) Argentine Time (America/Argentina/La_Rioja)' },
    { value: 'America/Argentina/Mendoza', label: '( GMT -3:00 ) Argentine Time (America/Argentina/Mendoza)' },
    { value: 'America/Argentina/Rio_Gallegos', label: '( GMT -3:00 ) Argentine Time (America/Argentina/Rio_Gallegos)' },
    { value: 'America/Argentina/Salta', label: '( GMT -3:00 ) Argentine Time (America/Argentina/Salta)' },
    { value: 'America/Argentina/San_Juan', label: '( GMT -3:00 ) Argentine Time (America/Argentina/San_Juan)' },
    { value: 'America/Argentina/San_Luis', label: '( GMT -3:00 ) Argentine Time (America/Argentina/San_Luis)' },
    { value: 'America/Argentina/Tucuman', label: '( GMT -3:00 ) Argentine Time (America/Argentina/Tucuman)' },
    { value: 'America/Argentina/Ushuaia', label: '( GMT -3:00 ) Argentine Time (America/Argentina/Ushuaia)' },
    { value: 'America/Asuncion', label: '( GMT -3:00 ) Paraguay Time (America/Asuncion)' },
    { value: 'America/Bahia', label: '( GMT -3:00 ) Brasilia Time (America/Bahia)' },
    { value: 'America/Belem', label: '( GMT -3:00 ) Brasilia Time (America/Belem)' },
    { value: 'America/Cayenne', label: '( GMT -3:00 ) French Guiana Time (America/Cayenne)' },
    { value: 'America/Fortaleza', label: '( GMT -3:00 ) Brasilia Time (America/Fortaleza)' },
    { value: 'America/Glace_Bay', label: '( GMT -3:00 ) Atlantic Daylight Time (America/Glace_Bay)' },
    { value: 'America/Goose_Bay', label: '( GMT -3:00 ) Atlantic Daylight Time (America/Goose_Bay)' },
    { value: 'America/Halifax', label: '( GMT -3:00 ) Atlantic Daylight Time (America/Halifax)' },
    { value: 'America/Maceio', label: '( GMT -3:00 ) Brasilia Time (America/Maceio)' },
    { value: 'America/Moncton', label: '( GMT -3:00 ) Atlantic Daylight Time (America/Moncton)' },
    { value: 'America/Montevideo', label: '( GMT -3:00 ) Uruguay Time (America/Montevideo)' },
    { value: 'America/Nuuk', label: '( GMT -3:00 ) Western Greenland Time (America/Nuuk)' },
    { value: 'America/Paramaribo', label: '( GMT -3:00 ) Suriname Time (America/Paramaribo)' },
    { value: 'America/Punta_Arenas', label: '( GMT -3:00 ) GMT-03:00 (America/Punta_Arenas)' },
    { value: 'America/Recife', label: '( GMT -3:00 ) Brasilia Time (America/Recife)' },
    { value: 'America/Santarem', label: '( GMT -3:00 ) Brasilia Time (America/Santarem)' },
    { value: 'America/Santiago', label: '( GMT -3:00 ) Chile Time (America/Santiago)' },
    { value: 'America/Sao_Paulo', label: '( GMT -3:00 ) Brasilia Time (America/Sao_Paulo)' },
    { value: 'America/Thule', label: '( GMT -3:00 ) Atlantic Daylight Time (America/Thule)' },
    { value: 'Antarctica/Palmer', label: '( GMT -3:00 ) Chile Time (Antarctica/Palmer)' },
    { value: 'Antarctica/Rothera', label: '( GMT -3:00 ) Rothera Time (Antarctica/Rothera)' },
    { value: 'Atlantic/Bermuda', label: '( GMT -3:00 ) Atlantic Daylight Time (Atlantic/Bermuda)' },
    { value: 'Atlantic/Stanley', label: '( GMT -3:00 ) Falkland Is. Time (Atlantic/Stanley)' },
    { value: 'America/St_Johns', label: '( GMT -2:30 ) Newfoundland Daylight Time (America/St_Johns)' },
    { value: 'America/Miquelon', label: '( GMT -2:00 ) Pierre & Miquelon Daylight Time (America/Miquelon)' },
    { value: 'America/Noronha', label: '( GMT -2:00 ) Fernando de Noronha Time (America/Noronha)' },
    { value: 'Atlantic/South_Georgia', label: '( GMT -2:00 ) South Georgia Standard Time (Atlantic/South_Georgia)' },
    { value: 'America/Scoresbysund', label: '( GMT -1:00 ) Eastern Greenland Summer Time (America/Scoresbysund)' },
    { value: 'Atlantic/Azores', label: '( GMT -1:00 ) Azores Summer Time (Atlantic/Azores)' },
    { value: 'Atlantic/Cape_Verde', label: '( GMT -1:00 ) Cape Verde Time (Atlantic/Cape_Verde)' },
    { value: 'Africa/Abidjan', label: '( GMT 0:00 ) Greenwich Mean Time (Africa/Abidjan)' },
    { value: 'Africa/Bissau', label: '( GMT 0:00 ) Greenwich Mean Time (Africa/Bissau)' },
    { value: 'Africa/Monrovia', label: '( GMT 0:00 ) Greenwich Mean Time (Africa/Monrovia)' },
    { value: 'Africa/Sao_Tome', label: '( GMT 0:00 ) Greenwich Mean Time (Africa/Sao_Tome)' },
    { value: 'America/Danmarkshavn', label: '( GMT 0:00 ) Greenwich Mean Time (America/Danmarkshavn)' },
    { value: 'Antarctica/Troll', label: '( GMT 0:00 ) Coordinated Universal Time (Antarctica/Troll)' },
    { value: 'Atlantic/Canary', label: '( GMT 0:00 ) Western European Summer Time (Atlantic/Canary)' },
    { value: 'Atlantic/Faroe', label: '( GMT 0:00 ) Western European Time (Atlantic/Faroe)' },
    { value: 'Atlantic/Madeira', label: '( GMT 0:00 ) Western European Summer Time (Atlantic/Madeira)' },
    { value: 'Europe/Dublin', label: '( GMT 0:00 ) Irish Summer Time (Europe/Dublin)' },
    { value: 'Europe/Lisbon', label: '( GMT 0:00 ) Western European Summer Time (Europe/Lisbon)' },
    { value: 'Europe/London', label: '( GMT 0:00 ) British Summer Time (Europe/London)' },
    { value: 'GMT', label: '( GMT 0:00 ) Greenwich Mean Time (GMT)' },
    { value: 'Africa/Algiers', label: '( GMT +1:00 ) Central European Time (Africa/Algiers)' },
    { value: 'Africa/Casablanca', label: '( GMT +1:00 ) Western European Summer Time (Africa/Casablanca)' },
    { value: 'Africa/Ceuta', label: '( GMT +1:00 ) Central European Summer Time (Africa/Ceuta)' },
    { value: 'Africa/El_Aaiun', label: '( GMT +1:00 ) Western European Summer Time (Africa/El_Aaiun)' },
    { value: 'Africa/Lagos', label: '( GMT +1:00 ) Western African Time (Africa/Lagos)' },
    { value: 'Africa/Ndjamena', label: '( GMT +1:00 ) Western African Time (Africa/Ndjamena)' },
    { value: 'Africa/Tunis', label: '( GMT +1:00 ) Central European Time (Africa/Tunis)' },
    { value: 'Europe/Andorra', label: '( GMT +1:00 ) Central European Summer Time (Europe/Andorra)' },
    { value: 'Europe/Belgrade', label: '( GMT +1:00 ) Central European Summer Time (Europe/Belgrade)' },
    { value: 'Europe/Berlin', label: '( GMT +1:00 ) Central European Summer Time (Europe/Berlin)' },
    { value: 'Europe/Brussels', label: '( GMT +1:00 ) Central European Summer Time (Europe/Brussels)' },
    { value: 'Europe/Budapest', label: '( GMT +1:00 ) Central European Summer Time (Europe/Budapest)' },
    { value: 'Europe/Gibraltar', label: '( GMT +1:00 ) Central European Summer Time (Europe/Gibraltar)' },
    { value: 'Europe/Madrid', label: '( GMT +1:00 ) Central European Summer Time (Europe/Madrid)' },
    { value: 'Europe/Malta', label: '( GMT +1:00 ) Central European Summer Time (Europe/Malta)' },
    { value: 'Europe/Paris', label: '( GMT +1:00 ) Central European Summer Time (Europe/Paris)' },
    { value: 'Europe/Prague', label: '( GMT +1:00 ) Central European Summer Time (Europe/Prague)' },
    { value: 'Europe/Rome', label: '( GMT +1:00 ) Central European Summer Time (Europe/Rome)' },
    { value: 'Europe/Tirane', label: '( GMT +1:00 ) Central European Summer Time (Europe/Tirane)' },
    { value: 'Europe/Vienna', label: '( GMT +1:00 ) Central European Summer Time (Europe/Vienna)' },
    { value: 'Europe/Warsaw', label: '( GMT +1:00 ) Central European Summer Time (Europe/Warsaw)' },
    { value: 'Europe/Zurich', label: '( GMT +1:00 ) Central European Summer Time (Europe/Zurich)' },
    { value: 'MET', label: '( GMT +1:00 ) Middle Europe Summer Time (MET)' },
    { value: 'Africa/Cairo', label: '( GMT +2:00 ) Eastern European Time (Africa/Cairo)' },
    { value: 'Africa/Johannesburg', label: '( GMT +2:00 ) South Africa Standard Time (Africa/Johannesburg)' },
    { value: 'Africa/Juba', label: '( GMT +2:00 ) Central African Time (Africa/Juba)' },
    { value: 'Africa/Khartoum', label: '( GMT +2:00 ) Central African Time (Africa/Khartoum)' },
    { value: 'Africa/Maputo', label: '( GMT +2:00 ) Central African Time (Africa/Maputo)' },
    { value: 'Africa/Tripoli', label: '( GMT +2:00 ) Eastern European Time (Africa/Tripoli)' },
    { value: 'Africa/Windhoek', label: '( GMT +2:00 ) Central African Time (Africa/Windhoek)' },
    { value: 'Asia/Beirut', label: '( GMT +2:00 ) Eastern European Summer Time (Asia/Beirut)' },
    { value: 'Asia/Famagusta', label: '( GMT +2:00 ) GMT+02:00 (Asia/Famagusta)' },
    { value: 'Asia/Gaza', label: '( GMT +2:00 ) Eastern European Summer Time (Asia/Gaza)' },
    { value: 'Asia/Hebron', label: '( GMT +2:00 ) Eastern European Time (Asia/Hebron)' },
    { value: 'Asia/Jerusalem', label: '( GMT +2:00 ) Israel Daylight Time (Asia/Jerusalem)' },
    { value: 'Asia/Nicosia', label: '( GMT +2:00 ) Eastern European Summer Time (Asia/Nicosia)' },
    { value: 'EET', label: '( GMT +2:00 ) Eastern European Summer Time (EET)' },
    { value: 'Europe/Athens', label: '( GMT +2:00 ) Eastern European Summer Time (Europe/Athens)' },
    { value: 'Europe/Bucharest', label: '( GMT +2:00 ) Eastern European Summer Time (Europe/Bucharest)' },
    { value: 'Europe/Chisinau', label: '( GMT +2:00 ) Eastern European Summer Time (Europe/Chisinau)' },
    { value: 'Europe/Helsinki', label: '( GMT +2:00 ) Eastern European Summer Time (Europe/Helsinki)' },
    { value: 'Europe/Kaliningrad', label: '( GMT +2:00 ) Eastern European Time (Europe/Kaliningrad)' },
    { value: 'Europe/Kyiv', label: '( GMT +2:00 ) Eastern European Time (Europe/Kyiv)' },
    { value: 'Europe/Riga', label: '( GMT +2:00 ) Eastern European Summer Time (Europe/Riga)' },
    { value: 'Europe/Sofia', label: '( GMT +2:00 ) Eastern European Summer Time (Europe/Sofia)' },
    { value: 'Europe/Tallinn', label: '( GMT +2:00 ) Eastern European Summer Time (Europe/Tallinn)' },
    { value: 'Europe/Vilnius', label: '( GMT +2:00 ) Eastern European Summer Time (Europe/Vilnius)' },
    { value: 'Africa/Nairobi', label: '( GMT +3:00 ) Eastern African Time (Africa/Nairobi)' },
    { value: 'Asia/Amman', label: '( GMT +3:00 ) Eastern European Summer Time (Asia/Amman)' },
    { value: 'Asia/Baghdad', label: '( GMT +3:00 ) Arabia Standard Time (Asia/Baghdad)' },
    { value: 'Asia/Damascus', label: '( GMT +3:00 ) Eastern European Summer Time (Asia/Damascus)' },
    { value: 'Asia/Qatar', label: '( GMT +3:00 ) Arabia Standard Time (Asia/Qatar)' },
    { value: 'Asia/Riyadh', label: '( GMT +3:00 ) Arabia Standard Time (Asia/Riyadh)' },
    { value: 'Europe/Istanbul', label: '( GMT +3:00 ) Turkey Time (Europe/Istanbul)' },
    { value: 'Europe/Kirov', label: '( GMT +3:00 ) GMT+03:00 (Europe/Kirov)' },
    { value: 'Europe/Minsk', label: '( GMT +3:00 ) Moscow Standard Time (Europe/Minsk)' },
    { value: 'Europe/Moscow', label: '( GMT +3:00 ) Moscow Standard Time (Europe/Moscow)' },
    { value: 'Europe/Simferopol', label: '( GMT +3:00 ) Moscow Standard Time (Europe/Simferopol)' },
    { value: 'Europe/Volgograd', label: '( GMT +3:00 ) Moscow Standard Time (Europe/Volgograd)' },
    { value: 'Asia/Tehran', label: '( GMT +3:30 ) Iran Daylight Time (Asia/Tehran)' },
    { value: 'Asia/Baku', label: '( GMT +4:00 ) Azerbaijan Time (Asia/Baku)' },
    { value: 'Asia/Dubai', label: '( GMT +4:00 ) Gulf Standard Time (Asia/Dubai)' },
    { value: 'Asia/Tbilisi', label: '( GMT +4:00 ) Georgia Time (Asia/Tbilisi)' },
    { value: 'Asia/Yerevan', label: '( GMT +4:00 ) Armenia Time (Asia/Yerevan)' },
    { value: 'Europe/Astrakhan', label: '( GMT +4:00 ) GMT+04:00 (Europe/Astrakhan)' },
    { value: 'Europe/Samara', label: '( GMT +4:00 ) Samara Time (Europe/Samara)' },
    { value: 'Europe/Saratov', label: '( GMT +4:00 ) GMT+04:00 (Europe/Saratov)' },
    { value: 'Europe/Ulyanovsk', label: '( GMT +4:00 ) GMT+04:00 (Europe/Ulyanovsk)' },
    { value: 'Indian/Mauritius', label: '( GMT +4:00 ) Mauritius Time (Indian/Mauritius)' },
    { value: 'Asia/Kabul', label: '( GMT +4:30 ) Afghanistan Time (Asia/Kabul)' },
    { value: 'Antarctica/Mawson', label: '( GMT +5:00 ) Mawson Time (Antarctica/Mawson)' },
    { value: 'Asia/Aqtau', label: '( GMT +5:00 ) Aqtau Time (Asia/Aqtau)' },
    { value: 'Asia/Aqtobe', label: '( GMT +5:00 ) Aqtobe Time (Asia/Aqtobe)' },
    { value: 'Asia/Ashgabat', label: '( GMT +5:00 ) Turkmenistan Time (Asia/Ashgabat)' },
    { value: 'Asia/Atyrau', label: '( GMT +5:00 ) GMT+05:00 (Asia/Atyrau)' },
    { value: 'Asia/Dushanbe', label: '( GMT +5:00 ) Tajikistan Time (Asia/Dushanbe)' },
    { value: 'Asia/Karachi', label: '( GMT +5:00 ) Pakistan Time (Asia/Karachi)' },
    { value: 'Asia/Oral', label: '( GMT +5:00 ) Oral Time (Asia/Oral)' },
    { value: 'Asia/Qyzylorda', label: '( GMT +5:00 ) Qyzylorda Time (Asia/Qyzylorda)' },
    { value: 'Asia/Samarkand', label: '( GMT +5:00 ) Uzbekistan Time (Asia/Samarkand)' },
    { value: 'Asia/Tashkent', label: '( GMT +5:00 ) Uzbekistan Time (Asia/Tashkent)' },
    { value: 'Asia/Yekaterinburg', label: '( GMT +5:00 ) Yekaterinburg Time (Asia/Yekaterinburg)' },
    { value: 'Indian/Maldives', label: '( GMT +5:00 ) Maldives Time (Indian/Maldives)' },
    { value: 'Asia/Colombo', label: '( GMT +5:30 ) India Standard Time (Asia/Colombo)' },
    { value: 'Asia/Kolkata', label: '( GMT +5:30 ) India Standard Time (Asia/Kolkata)' },
    { value: 'Asia/Kathmandu', label: '( GMT +5:45 ) Nepal Time (Asia/Kathmandu)' },
    { value: 'Asia/Almaty', label: '( GMT +6:00 ) Alma-Ata Time (Asia/Almaty)' },
    { value: 'Asia/Bishkek', label: '( GMT +6:00 ) Kirgizstan Time (Asia/Bishkek)' },
    { value: 'Asia/Dhaka', label: '( GMT +6:00 ) Bangladesh Time (Asia/Dhaka)' },
    { value: 'Asia/Omsk', label: '( GMT +6:00 ) Omsk Time (Asia/Omsk)' },
    { value: 'Asia/Qostanay', label: '( GMT +6:00 ) Kostanay Standard Time (Asia/Qostanay)' },
    { value: 'Asia/Thimphu', label: '( GMT +6:00 ) Bhutan Time (Asia/Thimphu)' },
    { value: 'Asia/Urumqi', label: '( GMT +6:00 ) Xinjiang Standard Time (Asia/Urumqi)' },
    { value: 'Indian/Chagos', label: '( GMT +6:00 ) Indian Ocean Territory Time (Indian/Chagos)' },
    { value: 'Asia/Yangon', label: '( GMT +6:30 ) Myanmar Time (Asia/Yangon)' },
    { value: 'Antarctica/Davis', label: '( GMT +7:00 ) Davis Time (Antarctica/Davis)' },
    { value: 'Asia/Bangkok', label: '( GMT +7:00 ) Indochina Time (Asia/Bangkok)' },
    { value: 'Asia/Barnaul', label: '( GMT +7:00 ) GMT+07:00 (Asia/Barnaul)' },
    { value: 'Asia/Ho_Chi_Minh', label: '( GMT +7:00 ) Indochina Time (Asia/Ho_Chi_Minh)' },
    { value: 'Asia/Hovd', label: '( GMT +7:00 ) Hovd Time (Asia/Hovd)' },
    { value: 'Asia/Jakarta', label: '( GMT +7:00 ) West Indonesia Time (Asia/Jakarta)' },
    { value: 'Asia/Krasnoyarsk', label: '( GMT +7:00 ) Krasnoyarsk Time (Asia/Krasnoyarsk)' },
    { value: 'Asia/Novokuznetsk', label: '( GMT +7:00 ) Krasnoyarsk Time (Asia/Novokuznetsk)' },
    { value: 'Asia/Novosibirsk', label: '( GMT +7:00 ) Novosibirsk Time (Asia/Novosibirsk)' },
    { value: 'Asia/Pontianak', label: '( GMT +7:00 ) West Indonesia Time (Asia/Pontianak)' },
    { value: 'Asia/Tomsk', label: '( GMT +7:00 ) GMT+07:00 (Asia/Tomsk)' },
    { value: 'Asia/Choibalsan', label: '( GMT +8:00 ) Choibalsan Time (Asia/Choibalsan)' },
    { value: 'Asia/Hong_Kong', label: '( GMT +8:00 ) Hong Kong Time (Asia/Hong_Kong)' },
    { value: 'Asia/Irkutsk', label: '( GMT +8:00 ) Irkutsk Time (Asia/Irkutsk)' },
    { value: 'Asia/Kuching', label: '( GMT +8:00 ) Malaysia Time (Asia/Kuching)' },
    { value: 'Asia/Macau', label: '( GMT +8:00 ) China Standard Time (Asia/Macau)' },
    { value: 'Asia/Makassar', label: '( GMT +8:00 ) Central Indonesia Time (Asia/Makassar)' },
    { value: 'Asia/Manila', label: '( GMT +8:00 ) Philippines Standard Time (Asia/Manila)' },
    { value: 'Asia/Shanghai', label: '( GMT +8:00 ) China Standard Time (Asia/Shanghai)' },
    { value: 'Asia/Singapore', label: '( GMT +8:00 ) Singapore Time (Asia/Singapore)' },
    { value: 'Asia/Taipei', label: '( GMT +8:00 ) China Standard Time (Asia/Taipei)' },
    { value: 'Asia/Ulaanbaatar', label: '( GMT +8:00 ) Ulaanbaatar Time (Asia/Ulaanbaatar)' },
    { value: 'Australia/Perth', label: '( GMT +8:00 ) Australian Western Standard Time (Australia/Perth)' },
    { value: 'Australia/Eucla', label: '( GMT +8:45 ) Australian Central Western Standard Time (Australia/Eucla)' },
    { value: 'Asia/Chita', label: '( GMT +9:00 ) Yakutsk Time (Asia/Chita)' },
    { value: 'Asia/Dili', label: '( GMT +9:00 ) Timor-Leste Time (Asia/Dili)' },
    { value: 'Asia/Jayapura', label: '( GMT +9:00 ) East Indonesia Time (Asia/Jayapura)' },
    { value: 'Asia/Khandyga', label: '( GMT +9:00 ) Yakutsk Time (Asia/Khandyga)' },
    { value: 'Asia/Pyongyang', label: '( GMT +9:00 ) Korea Standard Time (Asia/Pyongyang)' },
    { value: 'Asia/Seoul', label: '( GMT +9:00 ) Korea Standard Time (Asia/Seoul)' },
    { value: 'Asia/Tokyo', label: '( GMT +9:00 ) Japan Standard Time (Asia/Tokyo)' },
    { value: 'Asia/Yakutsk', label: '( GMT +9:00 ) Yakutsk Time (Asia/Yakutsk)' },
    { value: 'Pacific/Palau', label: '( GMT +9:00 ) Palau Time (Pacific/Palau)' },
    { value: 'Australia/Darwin', label: '( GMT +9:30 ) Australian Central Standard Time (Northern Territory) (Australia/Darwin)' },
    { value: 'Asia/Ust-Nera', label: '( GMT +10:00 ) Ust-Nera Time (Asia/Ust-Nera)' },
    { value: 'Asia/Vladivostok', label: '( GMT +10:00 ) Vladivostok Time (Asia/Vladivostok)' },
    { value: 'Australia/Brisbane', label: '( GMT +10:00 ) Australian Eastern Standard Time (Queensland) (Australia/Brisbane)' },
    { value: 'Australia/Lindeman', label: '( GMT +10:00 ) Australian Eastern Standard Time (Queensland) (Australia/Lindeman)' },
    { value: 'Pacific/Guam', label: '( GMT +10:00 ) Chamorro Standard Time (Pacific/Guam)' },
    { value: 'Pacific/Port_Moresby', label: '( GMT +10:00 ) Papua New Guinea Time (Pacific/Port_Moresby)' },
    { value: 'Australia/Adelaide', label: '( GMT +10:30 ) Australian Central Standard Time (South Australia) (Australia/Adelaide)' },
    { value: 'Australia/Broken_Hill', label: '( GMT +10:30 ) Australian Central Standard Time (Australia/Broken_Hill)' },
    { value: 'Antarctica/Casey', label: '( GMT +11:00 ) Australian Western Standard Time (Antarctica/Casey)' },
    { value: 'Antarctica/Macquarie', label: '( GMT +11:00 ) Australian Eastern Daylight Time (Macquarie) (Antarctica/Macquarie)' },
    { value: 'Asia/Magadan', label: '( GMT +11:00 ) Magadan Time (Asia/Magadan)' },
    { value: 'Asia/Sakhalin', label: '( GMT +11:00 ) Sakhalin Time (Asia/Sakhalin)' },
    { value: 'Asia/Srednekolymsk', label: '( GMT +11:00 ) Srednekolymsk Time (Asia/Srednekolymsk)' },
    { value: 'Australia/Hobart', label: '( GMT +11:00 ) Australian Eastern Standard Time (Tasmania) (Australia/Hobart)' },
    { value: 'Australia/Lord_Howe', label: '( GMT +11:00 ) Lord Howe Standard Time (Australia/Lord_Howe)' },
    { value: 'Australia/Melbourne', label: '( GMT +11:00 ) Australian Eastern Standard Time (Victoria) (Australia/Melbourne)' },
    { value: 'Australia/Sydney', label: '( GMT +11:00 ) Australian Eastern Standard Time (New South Wales) (Australia/Sydney)' },
    { value: 'Pacific/Bougainville', label: '( GMT +11:00 ) Bougainville Standard Time (Pacific/Bougainville)' },
    { value: 'Pacific/Efate', label: '( GMT +11:00 ) Vanuatu Time (Pacific/Efate)' },
    { value: 'Pacific/Guadalcanal', label: '( GMT +11:00 ) Solomon Is. Time (Pacific/Guadalcanal)' },
    { value: 'Pacific/Kosrae', label: '( GMT +11:00 ) Kosrae Time (Pacific/Kosrae)' },
    { value: 'Pacific/Noumea', label: '( GMT +11:00 ) New Caledonia Time (Pacific/Noumea)' },
    { value: 'Asia/Anadyr', label: '( GMT +12:00 ) Anadyr Time (Asia/Anadyr)' },
    { value: 'Asia/Kamchatka', label: '( GMT +12:00 ) Petropavlovsk-Kamchatski Time (Asia/Kamchatka)' },
    { value: 'Pacific/Fiji', label: '( GMT +12:00 ) Fiji Time (Pacific/Fiji)' },
    { value: 'Pacific/Kwajalein', label: '( GMT +12:00 ) Marshall Islands Time (Pacific/Kwajalein)' },
    { value: 'Pacific/Nauru', label: '( GMT +12:00 ) Nauru Time (Pacific/Nauru)' },
    { value: 'Pacific/Norfolk', label: '( GMT +12:00 ) Norfolk Time (Pacific/Norfolk)' },
    { value: 'Pacific/Tarawa', label: '( GMT +12:00 ) Gilbert Is. Time (Pacific/Tarawa)' },
    { value: 'Pacific/Apia', label: '( GMT +13:00 ) West Samoa Standard Time (Pacific/Apia)' },
    { value: 'Pacific/Auckland', label: '( GMT +13:00 ) New Zealand Standard Time (Pacific/Auckland)' },
    { value: 'Pacific/Fakaofo', label: '( GMT +13:00 ) Tokelau Time (Pacific/Fakaofo)' },
    { value: 'Pacific/Kanton', label: '( GMT +13:00 ) Phoenix Is. Time (Pacific/Kanton)' },
    { value: 'Pacific/Tongatapu', label: '( GMT +13:00 ) Tonga Time (Pacific/Tongatapu)' },
    { value: 'Pacific/Chatham', label: '( GMT +13:45 ) Chatham Standard Time (Pacific/Chatham)' },
    { value: 'Pacific/Kiritimati', label: '( GMT +14:00 ) Line Is. Time (Pacific/Kiritimati)' }
  ];

  return (
    <div className="w-full max-h-[600px] overflow-y-auto px-1">
      {/* Meeting Template */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Meeting Template</label>
        <select
          value={meetingTemplate}
          onChange={(e) => setMeetingTemplate(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Meeting Settings</option>
          {templates.map((template, index) => (
            <option key={index} value={template}>
              {template}
            </option>
          ))}
        </select>
      </div>

      {/* Meeting Name */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Meeting Name</label>
        <input
          type="text"
          value={meetingName}
          onChange={(e) => setMeetingName(e.target.value)}
          placeholder="Enter Meeting Name"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Meeting starts on */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Meeting starts on (local time)
        </label>
        <div className="relative">
          <input
            type="text"
            readOnly
            value={formatToDisplay(startDateTime)}
            onClick={() => openPicker(startRef)}
            placeholder="Select start date and time"
            className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer bg-white"
          />
          <input
            ref={startRef}
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            // overlay the native input so clicks on the field or icon open the picker
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, zIndex: 2, cursor: 'pointer' }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Meeting Ends on */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Meeting Ends on (local time)
        </label>
        <div className="relative">
          <input
            type="text"
            readOnly
            value={formatToDisplay(endDateTime)}
            onClick={() => openPicker(endRef)}
            placeholder="Select end date and time"
            className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer bg-white"
          />
          <input
            ref={endRef}
            type="datetime-local"
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, zIndex: 2, cursor: 'pointer' }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Timezone */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Timezone</label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {timezones.map((tz, index) => (
            <option key={index} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      {/* Recurring Meeting */}
      <div className="mb-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-semibold text-gray-700">Recurring Meeting</span>
        </label>
      </div>

      {/* Recurring options (visible only when recurring is checked) */}
      {isRecurring && (
        <div className="mb-4 border rounded p-3">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Repeat type</label>
            <select
              value={repeatType}
              onChange={(e) => setRepeatType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Repeat Type</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              {/* <option value="Yearly">Yearly</option> */}
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Repeat every</label>
            <div className="flex items-center gap-3">
              <select
                value={repeatEvery}
                onChange={(e) => setRepeatEvery(parseInt(e.target.value, 15))}
                className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <select
                value={repeatUnit}
                onChange={(e) => setRepeatUnit(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
              >
                <option>Days</option>
                <option>Weeks</option>
                <option>Months</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ends</label>
            <div className="flex items-center gap-3 mb-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="repeatEnds"
                  checked={repeatEndsType === 'onDate'}
                  onChange={() => setRepeatEndsType('onDate')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">On Select date</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="repeatEnds"
                  checked={repeatEndsType === 'after'}
                  onChange={() => setRepeatEndsType('after')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">After</span>
              </label>
            </div>

            {repeatEndsType === 'onDate' ? (
              <div className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={formatToDisplay(repeatEndDate)}
                    onClick={() => openPicker(repeatEndRef)}
                    placeholder="Select end date"
                    className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md bg-white cursor-pointer"
                  />
                  <input
                    ref={repeatEndRef}
                    type="datetime-local"
                    value={repeatEndDate}
                    onChange={(e) => setRepeatEndDate(e.target.value)}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, zIndex: 2, cursor: 'pointer' }}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <select
                  value={repeatAfterCount}
                  onChange={(e) => setRepeatAfterCount(parseInt(e.target.value, 10))}
                  className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span className="text-sm text-gray-700">Times</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Host */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Host</label>
        <select
          value={host}
          onChange={(e) => setHost(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
            {hosts.map((h, index) => {
              const value = typeof h === 'string' ? h : (h.value ?? h.Value ?? h.id ?? h.ID ?? '');
              const label = typeof h === 'string' ? h : (h.label ?? h.Text ?? h.Name ?? h.FullName ?? String(value));
              return (
                <option key={index} value={value}>
                  {label}
                </option>
              );
            })}
        </select>
      </div>

      {/* Add Co-Host */}
      <div className="mb-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={addCoHost}
            onChange={(e) => setAddCoHost(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-semibold text-gray-700">Add Co-Host</span>
        </label>
      </div>

      {/* Co-Host selector (shows only when checkbox checked) */}
      {addCoHost && (
        <div className="mb-4 relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Co-Host(s)</label>

          <div className="flex flex-wrap gap-2 mb-2">
            {coHosts.map((c, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full text-sm">
                <span>{c}</span>
                <button
                  type="button"
                  onClick={() => setCoHosts(prev => prev.filter(item => item !== c))}
                  className="text-gray-500 hover:text-red-600"
                  title="Remove co-host"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <input
            type="text"
            value={coHostQuery}
            onChange={(e) => { setCoHostQuery(e.target.value); setShowCoHostSuggestions(true); }}
            onFocus={() => setShowCoHostSuggestions(true)}
            onBlur={() => setTimeout(() => setShowCoHostSuggestions(false), 150)}
            placeholder="Search co-host by id or name"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {showCoHostSuggestions && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-40 overflow-auto">
              {users
                .filter(u => u.toLowerCase().includes(coHostQuery.toLowerCase()) && !coHosts.includes(u))
                .map((u, i) => (
                  <div
                    key={i}
                    onMouseDown={(ev) => {
                      // use onMouseDown to avoid losing focus before click
                      ev.preventDefault();
                      setCoHosts(prev => [...prev, u]);
                      setCoHostQuery('');
                      setShowCoHostSuggestions(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {u}
                  </div>
                ))
              }
              {users.filter(u => u.toLowerCase().includes(coHostQuery.toLowerCase()) && !coHosts.includes(u)).length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Participant(s) */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Participant(s)</label>
        <input
          type="text"
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          placeholder="Search by name, email number"
          disabled={!!leadParticipantName}
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${leadParticipantName ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
      </div>
    </div>
  );
};

export default CreateMeetingForm;
