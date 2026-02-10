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
  close: string;

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
  addNewMaintenanceRecord: string;
  chooseMethod: string;
  scanReceipt: string;
  autoFillFromPhoto: string;
  manualEntry: string;
  typeDetailsYourself: string;
  costBreakdown: string;
  partsCostLabel: string;
  laborCostLabel: string;
  additionalNotesOptional: string;
  saveRecord: string;
  serviceDescPlaceholder: string;
  notesPlaceholder: string;
  maxPhotosAllowed: string;
  photoSizeLimit: string;
  dateDescKmRequired: string;
  partsCostInvalid: string;
  laborCostInvalid: string;
  addVehicleFirst: string;

  // Maintenance List
  noMaintenanceHistory: string;
  addRecordToStart: string;
  serviceHistory: string;

  // Maintenance Item
  parts: string;
  labor: string;
  total: string;
  clickToView: string;
  photoOf: string;

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
  editVehicle: string;
  addNewVehicle: string;
  vehicleIcon: string;
  changeEmoji: string;
  useEmoji: string;
  uploadImage: string;
  basicInfo: string;
  year: string;
  registrationNumber: string;
  odometerInfo: string;
  currentOdometerKm: string;
  purchaseOdometerKm: string;
  purchaseDate: string;
  tyreAndRoadTax: string;
  frontTyrePressure: string;
  rearTyrePressure: string;
  roadTaxExpiry: string;
  expired: string;
  odometer: string;
  registration: string;
  tyrePressureLabel: string;
  front: string;
  rear: string;
  roadTax: string;
  noVehiclesMsg: string;
  nameTypeOdometerRequired: string;
  odometerMustBeValid: string;
  tyrePressureFrontInvalid: string;
  tyrePressureRearInvalid: string;
  failedSaveVehicle: string;
  confirmDeleteVehicle: string;
  failedDeleteVehicle: string;

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
  serviceReminders: string;
  newReminder: string;
  editReminder: string;
  titleAndVehicleRequired: string;
  setAtLeastOneReminder: string;
  failedSaveReminder: string;
  timeBasedReminder: string;
  mileageBasedReminder: string;
  dueDate: string;
  repeatLabel: string;
  noRepeat: string;
  monthlyOption: string;
  quarterlyOption: string;
  biannuallyOption: string;
  yearlyOption: string;
  dueAtKm: string;
  repeatEveryKm: string;
  noActiveRemindersMsg: string;
  dueNow: string;
  dueLabel: string;
  dueAtLabel: string;
  vehicleLabel: string;

  // Cost Dashboard
  totalCost: string;
  averageCost: string;
  lastServiceCost: string;
  thisMonth: string;
  thisYear: string;
  costOverview: string;
  partsCost: string;
  laborCost: string;
  avgPerService: string;
  ofTotal: string;
  noData: string;
  services: string;
  basedOnAllRecords: string;

  // AI Suggestions
  aiSuggestions: string;
  generatingRecommendations: string;
  getRecommendations: string;

  // Auth
  login: string;
  register: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordMinLength: string;
  invalidCredentials: string;
  emailInUse: string;
  authError: string;
  pleaseWait: string;
  noAccount: string;
  hasAccount: string;

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

  // Announcements
  announcements: string;
  newUpdates: string;
  noAnnouncements: string;
  markAllAsRead: string;
  markAsRead: string;
  selectVehicle: string;
  vehicles_count: string;

  // Mileage Tracker
  mileageTracker: string;
  mileageSubtitle: string;
  mileage: string;
  addMileageLog: string;
  editMileageLog: string;
  newMileageLog: string;
  fuelEfficiency: string;
  totalFuelCost: string;
  fuelStops: string;
  monthly: string;
  includeFuelData: string;
  fuelAmount: string;
  fuelCostRM: string;
  pricePerLiter: string;
  mileageNotesPlaceholder: string;
  mileageReminders: string;
  remaining: string;
  distanceBetweenServices: string;
  mileageHistory: string;
  noMileageLogs: string;
  fuelStop: string;
  totalFuel: string;
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
    close: 'Close',

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
    addNewMaintenanceRecord: 'Add New Maintenance Record',
    chooseMethod: 'Choose your preferred method',
    scanReceipt: 'Scan Receipt',
    autoFillFromPhoto: 'Auto-fill from photo',
    manualEntry: 'Manual Entry',
    typeDetailsYourself: 'Type details yourself',
    costBreakdown: 'Cost Breakdown',
    partsCostLabel: 'Parts Cost (RM)',
    laborCostLabel: 'Labor Cost (RM)',
    additionalNotesOptional: 'Additional Notes (Optional)',
    saveRecord: 'Save Record',
    serviceDescPlaceholder: 'e.g., Oil change, new chain and sprockets, brake pads replacement',
    notesPlaceholder: 'Any additional information, observations, or reminders...',
    maxPhotosAllowed: 'Maximum 5 photos allowed',
    photoSizeLimit: 'Each photo must be less than 2MB',
    dateDescKmRequired: 'Date, description, and kilometers are required.',
    partsCostInvalid: 'Parts cost must be a valid positive number.',
    laborCostInvalid: 'Labor cost must be a valid positive number.',
    addVehicleFirst: 'Please add a vehicle first to start tracking maintenance.',

    // Maintenance List
    noMaintenanceHistory: 'No Maintenance History',
    addRecordToStart: 'Click "Add New Maintenance Record" to log your first service.',
    serviceHistory: 'Service History',

    // Maintenance Item
    parts: 'Parts',
    labor: 'Labor',
    total: 'Total',
    clickToView: 'Click to view',
    photoOf: 'of',

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
    editVehicle: 'Edit Vehicle',
    addNewVehicle: 'Add New Vehicle',
    vehicleIcon: 'Vehicle Icon',
    changeEmoji: 'Change Emoji',
    useEmoji: 'Use Emoji',
    uploadImage: 'Upload Image',
    basicInfo: 'Basic Information',
    year: 'Year',
    registrationNumber: 'Registration Number',
    odometerInfo: 'Odometer Information',
    currentOdometerKm: 'Current Odometer (km)',
    purchaseOdometerKm: 'Purchase Odometer (km)',
    purchaseDate: 'Purchase Date',
    tyreAndRoadTax: 'Tyre & Road Tax',
    frontTyrePressure: 'Front Tyre Pressure (PSI)',
    rearTyrePressure: 'Rear Tyre Pressure (PSI)',
    roadTaxExpiry: 'Road Tax Expiry Date',
    expired: 'Expired',
    odometer: 'Odometer',
    registration: 'Registration',
    tyrePressureLabel: 'Tyre Pressure',
    front: 'F',
    rear: 'R',
    roadTax: 'Road Tax',
    noVehiclesMsg: 'No vehicles yet. Add your first motorcycle to get started!',
    nameTypeOdometerRequired: 'Name, type, and current odometer are required.',
    odometerMustBeValid: 'Current odometer must be a valid positive number.',
    tyrePressureFrontInvalid: 'Front tyre pressure must be between 0 and 100 PSI.',
    tyrePressureRearInvalid: 'Rear tyre pressure must be between 0 and 100 PSI.',
    failedSaveVehicle: 'Failed to save vehicle. Please try again.',
    confirmDeleteVehicle: 'Are you sure you want to delete this vehicle? All associated maintenance records and reminders will also be deleted.',
    failedDeleteVehicle: 'Failed to delete vehicle. Please try again.',

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
    serviceReminders: 'Service Reminders',
    newReminder: 'New Reminder',
    editReminder: 'Edit Reminder',
    titleAndVehicleRequired: 'Title and vehicle are required.',
    setAtLeastOneReminder: 'Please set at least one reminder: date or mileage.',
    failedSaveReminder: 'Failed to save reminder. Please try again.',
    timeBasedReminder: 'Time-based reminder',
    mileageBasedReminder: 'Mileage-based reminder',
    dueDate: 'Due Date',
    repeatLabel: 'Repeat',
    noRepeat: 'No repeat',
    monthlyOption: 'Monthly',
    quarterlyOption: 'Quarterly',
    biannuallyOption: 'Every 6 months',
    yearlyOption: 'Yearly',
    dueAtKm: 'Due at (km)',
    repeatEveryKm: 'Repeat every (km)',
    noActiveRemindersMsg: 'No active reminders. Add one to stay on top of maintenance!',
    dueNow: 'DUE NOW',
    dueLabel: 'Due',
    dueAtLabel: 'Due at',
    vehicleLabel: 'Vehicle',

    // Cost Dashboard
    totalCost: 'Total Cost',
    averageCost: 'Average Cost',
    lastServiceCost: 'Last Service',
    thisMonth: 'This Month',
    thisYear: 'This Year',
    costOverview: 'Cost Overview',
    partsCost: 'Parts Cost',
    laborCost: 'Labor Cost',
    avgPerService: 'Avg per Service',
    ofTotal: 'of total',
    noData: 'No data',
    services: 'services',
    basedOnAllRecords: 'Based on all records',

    // AI Suggestions
    aiSuggestions: 'AI Service Recommendations',
    generatingRecommendations: 'Generating recommendations...',
    getRecommendations: 'Get AI Recommendations',

    // Auth
    login: 'Log In',
    register: 'Register',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    password: 'Password',
    passwordMinLength: 'Password must be at least 6 characters long.',
    invalidCredentials: 'Invalid email or password.',
    emailInUse: 'Email is already in use or invalid.',
    authError: 'An error occurred. Please try again.',
    pleaseWait: 'Please wait...',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',

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

    // Announcements
    announcements: 'Announcements',
    newUpdates: 'New Updates',
    noAnnouncements: 'No announcements yet',
    markAllAsRead: 'Mark all as read',
    markAsRead: 'Mark as read',
    selectVehicle: 'Select Vehicle',
    vehicles_count: 'vehicles',

    // Mileage Tracker
    mileageTracker: 'Mileage Tracker',
    mileageSubtitle: 'Track your rides and fuel consumption',
    mileage: 'Mileage',
    addMileageLog: 'Add Mileage Log',
    editMileageLog: 'Edit Mileage Log',
    newMileageLog: 'New Mileage Log',
    fuelEfficiency: 'Fuel Efficiency',
    totalFuelCost: 'Total Fuel Cost',
    fuelStops: 'fuel stops',
    monthly: 'mo',
    includeFuelData: 'Include fuel fill-up data',
    fuelAmount: 'Fuel Amount',
    fuelCostRM: 'Fuel Cost',
    pricePerLiter: 'Price per liter',
    mileageNotesPlaceholder: 'e.g., Highway ride, daily commute...',
    mileageReminders: 'Mileage Reminders',
    remaining: 'remaining',
    distanceBetweenServices: 'Distance Between Services',
    mileageHistory: 'Mileage Log History',
    noMileageLogs: 'No mileage logs yet. Add your first entry!',
    fuelStop: 'Fuel',
    totalFuel: 'total fuel',
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
    close: 'Tutup',

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
    addNewMaintenanceRecord: 'Tambah Rekod Penyelenggaraan Baharu',
    chooseMethod: 'Pilih kaedah pilihan anda',
    scanReceipt: 'Imbas Resit',
    autoFillFromPhoto: 'Isi automatik dari foto',
    manualEntry: 'Kemasukan Manual',
    typeDetailsYourself: 'Taip butiran sendiri',
    costBreakdown: 'Pecahan Kos',
    partsCostLabel: 'Kos Alat Ganti (RM)',
    laborCostLabel: 'Kos Buruh (RM)',
    additionalNotesOptional: 'Nota Tambahan (Pilihan)',
    saveRecord: 'Simpan Rekod',
    serviceDescPlaceholder: 'cth., Tukar minyak, rantai dan sproket baharu, tukar pad brek',
    notesPlaceholder: 'Sebarang maklumat tambahan, pemerhatian, atau peringatan...',
    maxPhotosAllowed: 'Maksimum 5 foto dibenarkan',
    photoSizeLimit: 'Setiap foto mesti kurang daripada 2MB',
    dateDescKmRequired: 'Tarikh, penerangan, dan kilometer diperlukan.',
    partsCostInvalid: 'Kos alat ganti mesti nombor positif yang sah.',
    laborCostInvalid: 'Kos buruh mesti nombor positif yang sah.',
    addVehicleFirst: 'Sila tambah kenderaan terlebih dahulu untuk mula menjejak penyelenggaraan.',

    // Maintenance List
    noMaintenanceHistory: 'Tiada Sejarah Penyelenggaraan',
    addRecordToStart: 'Klik "Tambah Rekod Penyelenggaraan Baharu" untuk merekod servis pertama anda.',
    serviceHistory: 'Sejarah Servis',

    // Maintenance Item
    parts: 'Alat Ganti',
    labor: 'Buruh',
    total: 'Jumlah',
    clickToView: 'Klik untuk lihat',
    photoOf: 'daripada',

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
    editVehicle: 'Edit Kenderaan',
    addNewVehicle: 'Tambah Kenderaan Baharu',
    vehicleIcon: 'Ikon Kenderaan',
    changeEmoji: 'Tukar Emoji',
    useEmoji: 'Guna Emoji',
    uploadImage: 'Muat Naik Imej',
    basicInfo: 'Maklumat Asas',
    year: 'Tahun',
    registrationNumber: 'No. Pendaftaran',
    odometerInfo: 'Maklumat Odometer',
    currentOdometerKm: 'Odometer Semasa (km)',
    purchaseOdometerKm: 'Odometer Pembelian (km)',
    purchaseDate: 'Tarikh Pembelian',
    tyreAndRoadTax: 'Tayar & Cukai Jalan',
    frontTyrePressure: 'Tekanan Tayar Hadapan (PSI)',
    rearTyrePressure: 'Tekanan Tayar Belakang (PSI)',
    roadTaxExpiry: 'Tarikh Tamat Cukai Jalan',
    expired: 'Tamat Tempoh',
    odometer: 'Odometer',
    registration: 'Pendaftaran',
    tyrePressureLabel: 'Tekanan Tayar',
    front: 'H',
    rear: 'B',
    roadTax: 'Cukai Jalan',
    noVehiclesMsg: 'Tiada kenderaan lagi. Tambah motosikal pertama anda untuk bermula!',
    nameTypeOdometerRequired: 'Nama, jenis, dan odometer semasa diperlukan.',
    odometerMustBeValid: 'Odometer semasa mesti nombor positif yang sah.',
    tyrePressureFrontInvalid: 'Tekanan tayar hadapan mesti antara 0 dan 100 PSI.',
    tyrePressureRearInvalid: 'Tekanan tayar belakang mesti antara 0 dan 100 PSI.',
    failedSaveVehicle: 'Gagal menyimpan kenderaan. Sila cuba lagi.',
    confirmDeleteVehicle: 'Adakah anda pasti mahu memadamkan kenderaan ini? Semua rekod penyelenggaraan dan peringatan berkaitan juga akan dipadam.',
    failedDeleteVehicle: 'Gagal memadamkan kenderaan. Sila cuba lagi.',

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
    serviceReminders: 'Peringatan Servis',
    newReminder: 'Peringatan Baharu',
    editReminder: 'Edit Peringatan',
    titleAndVehicleRequired: 'Tajuk dan kenderaan diperlukan.',
    setAtLeastOneReminder: 'Sila tetapkan sekurang-kurangnya satu peringatan: tarikh atau perbatuan.',
    failedSaveReminder: 'Gagal menyimpan peringatan. Sila cuba lagi.',
    timeBasedReminder: 'Peringatan berdasarkan masa',
    mileageBasedReminder: 'Peringatan berdasarkan perbatuan',
    dueDate: 'Tarikh Tamat',
    repeatLabel: 'Ulang',
    noRepeat: 'Tiada ulangan',
    monthlyOption: 'Bulanan',
    quarterlyOption: 'Suku Tahunan',
    biannuallyOption: 'Setiap 6 bulan',
    yearlyOption: 'Tahunan',
    dueAtKm: 'Tamat pada (km)',
    repeatEveryKm: 'Ulang setiap (km)',
    noActiveRemindersMsg: 'Tiada peringatan aktif. Tambah satu untuk kekal di atas penyelenggaraan!',
    dueNow: 'PERLU SEKARANG',
    dueLabel: 'Tamat',
    dueAtLabel: 'Tamat pada',
    vehicleLabel: 'Kenderaan',

    // Cost Dashboard
    totalCost: 'Jumlah Kos',
    averageCost: 'Purata Kos',
    lastServiceCost: 'Servis Terakhir',
    thisMonth: 'Bulan Ini',
    thisYear: 'Tahun Ini',
    costOverview: 'Ringkasan Kos',
    partsCost: 'Kos Alat Ganti',
    laborCost: 'Kos Buruh',
    avgPerService: 'Purata setiap Servis',
    ofTotal: 'daripada jumlah',
    noData: 'Tiada data',
    services: 'servis',
    basedOnAllRecords: 'Berdasarkan semua rekod',

    // AI Suggestions
    aiSuggestions: 'Cadangan Servis AI',
    generatingRecommendations: 'Menjana cadangan...',
    getRecommendations: 'Dapatkan Cadangan AI',

    // Auth
    login: 'Log Masuk',
    register: 'Daftar',
    email: 'Emel',
    emailPlaceholder: 'anda@contoh.com',
    password: 'Kata Laluan',
    passwordMinLength: 'Kata laluan mesti sekurang-kurangnya 6 aksara.',
    invalidCredentials: 'Emel atau kata laluan tidak sah.',
    emailInUse: 'Emel sudah digunakan atau tidak sah.',
    authError: 'Ralat berlaku. Sila cuba lagi.',
    pleaseWait: 'Sila tunggu...',
    noAccount: 'Tiada akaun?',
    hasAccount: 'Sudah ada akaun?',

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

    // Announcements
    announcements: 'Pengumuman',
    newUpdates: 'Kemas Kini Baharu',
    noAnnouncements: 'Tiada pengumuman lagi',
    markAllAsRead: 'Tandakan semua sebagai dibaca',
    markAsRead: 'Tandakan sebagai dibaca',
    selectVehicle: 'Pilih Kenderaan',
    vehicles_count: 'kenderaan',

    // Mileage Tracker
    mileageTracker: 'Penjejak Perbatuan',
    mileageSubtitle: 'Jejak perjalanan dan penggunaan bahan api anda',
    mileage: 'Perbatuan',
    addMileageLog: 'Tambah Log Perbatuan',
    editMileageLog: 'Edit Log Perbatuan',
    newMileageLog: 'Log Perbatuan Baharu',
    fuelEfficiency: 'Kecekapan Bahan Api',
    totalFuelCost: 'Jumlah Kos Bahan Api',
    fuelStops: 'pengisian minyak',
    monthly: 'bln',
    includeFuelData: 'Sertakan data pengisian bahan api',
    fuelAmount: 'Jumlah Bahan Api',
    fuelCostRM: 'Kos Bahan Api',
    pricePerLiter: 'Harga per liter',
    mileageNotesPlaceholder: 'cth., Perjalanan lebuhraya, ulang-alik harian...',
    mileageReminders: 'Peringatan Perbatuan',
    remaining: 'berbaki',
    distanceBetweenServices: 'Jarak Antara Servis',
    mileageHistory: 'Sejarah Log Perbatuan',
    noMileageLogs: 'Tiada log perbatuan lagi. Tambah entri pertama anda!',
    fuelStop: 'Minyak',
    totalFuel: 'jumlah bahan api',
  },
};

export const getTranslation = (lang: Language): Translations => {
  return translations[lang];
};
