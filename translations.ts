export type Language = 'en' | 'ms';

export interface Translations {
  // Header
  appName: string;
  welcome: string;
  logout: string;
  activeVehicle: string;

  // Tabs
  overview: string;
  reminders: string;
  vehicles: string;

  // Buttons & Actions
  addRecord: string;
  updateRecord: string;
  cancel: string;
  edit: string;
  delete: string;
  save: string;
  add: string;
  viewDetails: string;
  hideDetails: string;
  download: string;
  uploadPhotos: string;
  previousPhoto: string;
  nextPhoto: string;

  // Form Labels
  date: string;
  description: string;
  kilometers: string;
  cost: string;
  costOptional: string;
  notes: string;
  notesOptional: string;
  photos: string;
  photosOptional: string;
  maxPhotos: string;

  // Maintenance Form
  addMaintenanceRecord: string;
  editMaintenanceRecord: string;
  serviceDate: string;
  odometerReading: string;
  serviceDescription: string;
  maintenanceDetails: string;
  additionalInfo: string;

  // Vehicle Manager
  myVehicles: string;
  addVehicle: string;
  vehicleName: string;
  vehicleModel: string;
  currentOdometer: string;
  licensePlate: string;
  active: string;
  setActive: string;
  noVehicles: string;
  addFirstVehicle: string;

  // Reminders
  maintenanceReminders: string;
  addReminder: string;
  reminderTitle: string;
  reminderType: string;
  dateBased: string;
  mileageBased: string;
  both: string;
  reminderDate: string;
  targetKilometers: string;
  completed: string;
  dismiss: string;
  noActiveReminders: string;
  dismissedReminders: string;

  // Cost Dashboard
  totalCost: string;
  averageCost: string;
  lastServiceCost: string;
  thisMonth: string;
  thisYear: string;

  // AI Suggestions
  aiSuggestions: string;
  generatingRecommendations: string;
  getRecommendations: string;

  // Messages
  pleaseSelectVehicle: string;
  loadingRecords: string;
  noRecordsYet: string;
  recordAdded: string;
  recordUpdated: string;
  recordDeleted: string;
  confirmDelete: string;
  mustBeLoggedIn: string;
  
  // Validation
  allFieldsRequired: string;
  invalidDate: string;
  invalidKilometers: string;

  // Welcome Screen
  welcomeTitle: string;
  welcomeMessage: string;
  getStarted: string;

  // Settings
  darkMode: string;
  lightMode: string;
  language: string;
  settings: string;

  // Footer
  allRightsReserved: string;
  footerTagline: string;
  madeWith: string;
  forRiders: string;
  footerDisclaimer: string;

  // Analytics
  analytics: string;
  analyticsSubtitle: string;
  noAnalyticsData: string;
  addRecordsForAnalytics: string;
  servicePatterns: string;
  predictions: string;
  costEfficiency: string;
  costPerKm: string;
  monthlyAverage: string;
  totalDistance: string;
  basedOnHistory: string;
  totalCostLabel: string;
  partsPerKm: string;
  laborPerKm: string;
  serviceBreakdown: string;
  costTrend: string;
  serviceTimeline: string;
  serviceFrequency: string;
  serviceCount: string;
  avgInterval: string;
  avgCost: string;
  lastPerformed: string;
  predictiveMaintenance: string;
  predictiveSubtitle: string;
  predictedAt: string;
  distanceRemaining: string;
  overdue: string;
  noPredictions: string;
  needMoreDataForPredictions: string;
  frequency: string;
  serviceType: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Header
    appName: 'MyMotoLog',
    welcome: 'Welcome',
    logout: 'Logout',
    activeVehicle: 'Active Vehicle',

    // Tabs
    overview: 'Overview',
    reminders: 'Reminders',
    vehicles: 'Vehicles',

    // Buttons & Actions
    addRecord: 'Add Record',
    updateRecord: 'Update Record',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    add: 'Add',
    viewDetails: 'View Details',
    hideDetails: 'Hide Details',
    download: 'Download',
    uploadPhotos: 'Upload Photos',
    previousPhoto: 'Previous photo',
    nextPhoto: 'Next photo',

    // Form Labels
    date: 'Date',
    description: 'Description',
    kilometers: 'Kilometers',
    cost: 'Cost',
    costOptional: 'Cost (Optional)',
    notes: 'Notes',
    notesOptional: 'Notes (Optional)',
    photos: 'Photos',
    photosOptional: 'Photos (Optional, Max 5)',
    maxPhotos: 'photos',

    // Maintenance Form
    addMaintenanceRecord: 'Add Maintenance Record',
    editMaintenanceRecord: 'Edit Maintenance Record',
    serviceDate: 'Service Date',
    odometerReading: 'Odometer Reading',
    serviceDescription: 'Service Description',
    maintenanceDetails: 'Maintenance Details',
    additionalInfo: 'Additional Information',

    // Vehicle Manager
    myVehicles: 'My Vehicles',
    addVehicle: 'Add Vehicle',
    vehicleName: 'Vehicle Name',
    vehicleModel: 'Model',
    currentOdometer: 'Current Odometer',
    licensePlate: 'License Plate',
    active: 'Active',
    setActive: 'Set Active',
    noVehicles: 'No vehicles yet',
    addFirstVehicle: 'Add Your First Vehicle',

    // Reminders
    maintenanceReminders: 'Maintenance Reminders',
    addReminder: 'Add Reminder',
    reminderTitle: 'Reminder Title',
    reminderType: 'Reminder Type',
    dateBased: 'Date-based',
    mileageBased: 'Mileage-based',
    both: 'Both',
    reminderDate: 'Reminder Date',
    targetKilometers: 'Target Kilometers',
    completed: 'Completed',
    dismiss: 'Dismiss',
    noActiveReminders: 'No active reminders',
    dismissedReminders: 'Dismissed Reminders',

    // Cost Dashboard
    totalCost: 'Total Cost',
    averageCost: 'Average Cost',
    lastServiceCost: 'Last Service',
    thisMonth: 'This Month',
    thisYear: 'This Year',

    // AI Suggestions
    aiSuggestions: 'AI Service Recommendations',
    generatingRecommendations: 'Generating recommendations...',
    getRecommendations: 'Get AI Recommendations',

    // Messages
    pleaseSelectVehicle: 'Please select or add a vehicle first.',
    loadingRecords: 'Loading your maintenance records...',
    noRecordsYet: 'No maintenance records yet. Add your first service log!',
    recordAdded: 'Maintenance record added successfully!',
    recordUpdated: 'Maintenance record updated successfully!',
    recordDeleted: 'Record deleted successfully.',
    confirmDelete: 'Are you sure you want to delete this record?',
    mustBeLoggedIn: 'You must be logged in to perform this action.',

    // Validation
    allFieldsRequired: 'Please fill in all required fields.',
    invalidDate: 'Please select a valid date.',
    invalidKilometers: 'Please enter a valid odometer reading.',

    // Welcome Screen
    welcomeTitle: 'Welcome to MyMotoLog!',
    welcomeMessage: 'Get started by adding your first vehicle.',
    getStarted: 'Get Started',

    // Settings
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    settings: 'Settings',

    // Footer
    allRightsReserved: 'All rights reserved.',
    footerTagline: 'Built for your motorcycle maintenance needs.',
    madeWith: 'Made with',
    forRiders: 'for riders',
    footerDisclaimer: 'Keep your ride safe and well-maintained. Regular maintenance ensures optimal performance and longevity.',

    // Analytics
    analytics: 'Analytics',
    analyticsSubtitle: 'Data-driven insights for your motorcycle maintenance',
    noAnalyticsData: 'No Analytics Data Available',
    addRecordsForAnalytics: 'Add maintenance records to see analytics and insights',
    servicePatterns: 'Service Patterns',
    predictions: 'Predictions',
    costEfficiency: 'Cost Efficiency',
    costPerKm: 'Cost per Kilometer',
    monthlyAverage: 'Monthly Average',
    totalDistance: 'Total Distance',
    basedOnHistory: 'Based on your history',
    totalCostLabel: 'Total',
    partsPerKm: 'Parts Cost/km',
    laborPerKm: 'Labor Cost/km',
    serviceBreakdown: 'Service Breakdown',
    costTrend: 'Cost Trend Over Time',
    serviceTimeline: 'Service Timeline',
    serviceFrequency: 'Service Frequency & Intervals',
    serviceCount: 'Services',
    avgInterval: 'Avg Interval',
    avgCost: 'Avg Cost',
    lastPerformed: 'Last Performed',
    predictiveMaintenance: 'Predictive Maintenance',
    predictiveSubtitle: 'Based on your maintenance history, here are predicted upcoming services',
    predictedAt: 'Predicted at',
    distanceRemaining: 'Distance remaining',
    overdue: 'overdue',
    noPredictions: 'No Predictions Available',
    needMoreDataForPredictions: 'Add more maintenance records (at least 2 of the same service type) to see predictive alerts',
    frequency: 'Frequency',
    serviceType: 'Service Type',
  },
  ms: {
    // Header
    appName: 'MyMotoLog',
    welcome: 'Selamat Datang',
    logout: 'Log Keluar',
    activeVehicle: 'Kenderaan Aktif',

    // Tabs
    overview: 'Gambaran',
    reminders: 'Peringatan',
    vehicles: 'Kenderaan',

    // Buttons & Actions
    addRecord: 'Tambah Rekod',
    updateRecord: 'Kemas Kini Rekod',
    cancel: 'Batal',
    edit: 'Edit',
    delete: 'Padam',
    save: 'Simpan',
    add: 'Tambah',
    viewDetails: 'Lihat Butiran',
    hideDetails: 'Sembunyikan Butiran',
    download: 'Muat Turun',
    uploadPhotos: 'Muat Naik Foto',
    previousPhoto: 'Foto sebelumnya',
    nextPhoto: 'Foto seterusnya',

    // Form Labels
    date: 'Tarikh',
    description: 'Penerangan',
    kilometers: 'Kilometer',
    cost: 'Kos',
    costOptional: 'Kos (Pilihan)',
    notes: 'Nota',
    notesOptional: 'Nota (Pilihan)',
    photos: 'Foto',
    photosOptional: 'Foto (Pilihan, Maksimum 5)',
    maxPhotos: 'foto',

    // Maintenance Form
    addMaintenanceRecord: 'Tambah Rekod Penyelenggaraan',
    editMaintenanceRecord: 'Edit Rekod Penyelenggaraan',
    serviceDate: 'Tarikh Servis',
    odometerReading: 'Bacaan Odometer',
    serviceDescription: 'Penerangan Servis',
    maintenanceDetails: 'Butiran Penyelenggaraan',
    additionalInfo: 'Maklumat Tambahan',

    // Vehicle Manager
    myVehicles: 'Kenderaan Saya',
    addVehicle: 'Tambah Kenderaan',
    vehicleName: 'Nama Kenderaan',
    vehicleModel: 'Model',
    currentOdometer: 'Odometer Semasa',
    licensePlate: 'No. Pendaftaran',
    active: 'Aktif',
    setActive: 'Tetapkan Aktif',
    noVehicles: 'Tiada kenderaan lagi',
    addFirstVehicle: 'Tambah Kenderaan Pertama Anda',

    // Reminders
    maintenanceReminders: 'Peringatan Penyelenggaraan',
    addReminder: 'Tambah Peringatan',
    reminderTitle: 'Tajuk Peringatan',
    reminderType: 'Jenis Peringatan',
    dateBased: 'Berdasarkan tarikh',
    mileageBased: 'Berdasarkan perbatuan',
    both: 'Kedua-duanya',
    reminderDate: 'Tarikh Peringatan',
    targetKilometers: 'Sasaran Kilometer',
    completed: 'Selesai',
    dismiss: 'Tutup',
    noActiveReminders: 'Tiada peringatan aktif',
    dismissedReminders: 'Peringatan Ditutup',

    // Cost Dashboard
    totalCost: 'Jumlah Kos',
    averageCost: 'Purata Kos',
    lastServiceCost: 'Servis Terakhir',
    thisMonth: 'Bulan Ini',
    thisYear: 'Tahun Ini',

    // AI Suggestions
    aiSuggestions: 'Cadangan Servis AI',
    generatingRecommendations: 'Menjana cadangan...',
    getRecommendations: 'Dapatkan Cadangan AI',

    // Messages
    pleaseSelectVehicle: 'Sila pilih atau tambah kenderaan terlebih dahulu.',
    loadingRecords: 'Memuatkan rekod penyelenggaraan anda...',
    noRecordsYet: 'Tiada rekod penyelenggaraan lagi. Tambah log servis pertama anda!',
    recordAdded: 'Rekod penyelenggaraan berjaya ditambah!',
    recordUpdated: 'Rekod penyelenggaraan berjaya dikemas kini!',
    recordDeleted: 'Rekod berjaya dipadam.',
    confirmDelete: 'Adakah anda pasti mahu memadam rekod ini?',
    mustBeLoggedIn: 'Anda mesti log masuk untuk melakukan tindakan ini.',

    // Validation
    allFieldsRequired: 'Sila isi semua medan yang diperlukan.',
    invalidDate: 'Sila pilih tarikh yang sah.',
    invalidKilometers: 'Sila masukkan bacaan odometer yang sah.',

    // Welcome Screen
    welcomeTitle: 'Selamat Datang ke MyMotoLog!',
    welcomeMessage: 'Mulakan dengan menambah kenderaan pertama anda.',
    getStarted: 'Mula',

    // Settings
    darkMode: 'Mod Gelap',
    lightMode: 'Mod Terang',
    language: 'Bahasa',
    settings: 'Tetapan',

    // Footer
    allRightsReserved: 'Hak cipta terpelihara.',
    footerTagline: 'Dibina untuk keperluan penyelenggaraan motosikal anda.',
    madeWith: 'Dibuat dengan',
    forRiders: 'untuk penunggang',
    footerDisclaimer: 'Pastikan tunggangan anda selamat dan diselenggara dengan baik. Penyelenggaraan berkala memastikan prestasi optimum dan jangka hayat panjang.',

    // Analytics
    analytics: 'Analitik',
    analyticsSubtitle: 'Pandangan berdasarkan data untuk penyelenggaraan motosikal anda',
    noAnalyticsData: 'Tiada Data Analitik',
    addRecordsForAnalytics: 'Tambah rekod penyelenggaraan untuk melihat analitik',
    servicePatterns: 'Corak Servis',
    predictions: 'Ramalan',
    costEfficiency: 'Kecekapan Kos',
    costPerKm: 'Kos per Kilometer',
    monthlyAverage: 'Purata Bulanan',
    totalDistance: 'Jumlah Jarak',
    basedOnHistory: 'Berdasarkan sejarah anda',
    totalCostLabel: 'Jumlah',
    partsPerKm: 'Kos Alat Ganti/km',
    laborPerKm: 'Kos Buruh/km',
    serviceBreakdown: 'Pecahan Servis',
    costTrend: 'Trend Kos Sepanjang Masa',
    serviceTimeline: 'Garis Masa Servis',
    serviceFrequency: 'Kekerapan & Selang Servis',
    serviceCount: 'Servis',
    avgInterval: 'Selang Purata',
    avgCost: 'Kos Purata',
    lastPerformed: 'Terakhir Dilakukan',
    predictiveMaintenance: 'Penyelenggaraan Ramalan',
    predictiveSubtitle: 'Berdasarkan sejarah penyelenggaraan anda, berikut adalah servis yang akan datang',
    predictedAt: 'Diramal pada',
    distanceRemaining: 'Jarak berbaki',
    overdue: 'tertunggak',
    noPredictions: 'Tiada Ramalan Tersedia',
    needMoreDataForPredictions: 'Tambah lebih banyak rekod penyelenggaraan (sekurang-kurangnya 2 jenis servis yang sama) untuk melihat amaran ramalan',
    frequency: 'Kekerapan',
    serviceType: 'Jenis Servis',
  },
};

export const getTranslation = (lang: Language): Translations => {
  return translations[lang];
};