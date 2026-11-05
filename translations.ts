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
  manageVehicles: string;

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

  // Splash Screen
  splashLoadingData: string;

  // Overview
  nextService: string;
  vehicleInfo: string;
  recentServiceHistory: string;
  viewAll: string;

  // Service History
  searchRecords: string;
  noSearchResults: string;

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

  // Road tax alerts & renewal
  roadTaxExpiredTitle: string;
  roadTaxSoonTitle: string;
  roadTaxExpiredAgo: string;
  roadTaxExpiredYesterday: string;
  roadTaxExpiresToday: string;
  roadTaxExpiresTomorrow: string;
  roadTaxExpiresIn: string;
  renew: string;
  renewNow: string;
  renewRoadTax: string;
  renewRoadTaxSummary: string;
  needsAction: string;
  roadTaxAlertsStay: string;
  newExpiryDate: string;
  newExpiryHint: string;
  expiryMustBeFuture: string;
  roadTaxRenewedUntil: string;
  saveNewDate: string;
  failedRenewRoadTax: string;
  roadTaxNotifyExpiredTitle: string;
  roadTaxNotifyExpiredBody: string;
  roadTaxNotifySoonTitle: string;
  roadTaxNotifySoonBody: string;
  remindTomorrow: string;
  notifyPromptTitle: string;
  notifyPromptBody: string;
  allow: string;
  notNow: string;

  // Sign-in: Google, forgot password, email verification
  continueWithGoogle: string;
  orDivider: string;
  forgotPassword: string;
  invalidLoginHint: string;
  resetPasswordTitle: string;
  resetPasswordHint: string;
  sendResetLink: string;
  backToLogin: string;
  resetLinkSent: string;
  enterYourEmail: string;
  invalidEmail: string;
  googleSignInFailed: string;
  googleAccountExists: string;
  googleAlreadyLinked: string;
  tooManyAttempts: string;
  authNetworkError: string;
  verifyEmailTitle: string;
  verifyEmailBody: string;
  sendVerifyLink: string;
  verifyLinkSent: string;
  iveVerified: string;
  notVerifiedYet: string;
  verifyEmailFailed: string;
  emailVerifiedDone: string;
  googleAccount: string;
  googleConnected: string;
  googleNotConnected: string;
  connect: string;

  // Roles
  accountRole: string;
  roleAdmin: string;
  roleSuperadmin: string;

  // Admin panel
  adminPanel: string;
  adminBack: string;
  adminRetry: string;
  adminCancel: string;
  adminYes: string;
  adminNo: string;
  adminYou: string;
  adminStatUsers: string;
  adminStatVehicles: string;
  adminStatDevices: string;
  adminStatRoadTaxExpired: string;
  adminSuperadminOnly: string;
  adminManageTeam: string;
  adminCountHint: string;
  adminUsers: string;
  adminUsersHint: string;
  adminActivity: string;
  adminActivityHint: string;
  adminAddTitle: string;
  adminFind: string;
  adminAddHint: string;
  adminEmailVerified: string;
  adminJoinedVia: string;
  adminMake: string;
  adminConfirmMake: string;
  adminMadeSuccess: string;
  adminConfirmRemove: string;
  adminRemovedSuccess: string;
  adminCurrentTeam: string;
  adminAddedOn: string;
  adminRemove: string;
  adminTeamNote: string;
  adminFindByEmail: string;
  adminNoUsers: string;
  adminShowingSome: string;
  adminStatusActive: string;
  adminStatusDisabled: string;
  adminJoined: string;
  adminLastSignIn: string;
  adminSignInMethods: string;
  adminEmailVerifiedLabel: string;
  adminProviderPassword: string;
  adminPrivateNote: string;
  adminEnable: string;
  adminDisable: string;
  adminDisableReason: string;
  adminReasonRequired: string;
  adminConfirmEnable: string;
  adminDisableNote: string;
  adminFilterAll: string;
  adminFilterRoles: string;
  adminFilterUsers: string;
  adminNoActivity: string;
  adminReasonPrefix: string;
  adminLogNote: string;
  adminLogRoleAdded: string;
  adminLogRoleRemoved: string;
  adminLogUserDisabled: string;
  adminLogUserEnabled: string;
  adminErrNoAccess: string;
  adminErrUserNotFound: string;
  adminErrQueryTooShort: string;
  adminErrSelf: string;
  adminErrSuperadmin: string;
  adminErrAlreadyAdmin: string;
  adminErrNotAdmin: string;
  adminErrNotVerified: string;
  adminErrUserDisabled: string;
  adminErrRemoveRoleFirst: string;
  adminErrAlreadyDisabled: string;
  adminErrNotDisabled: string;
  adminErrGeneric: string;

  // Admin notifications
  adminNewNotification: string;
  adminManage: string;
  adminSendHistory: string;
  adminSendHistoryHint: string;
  adminSendNotification: string;
  adminFilterSends: string;
  adminLogNotificationSent: string;
  adminLogNotificationDetail: string;
  adminLogLimitChanged: string;
  adminLogLimitDetail: string;
  adminErrInvalidAudience: string;
  adminErrInvalidContent: string;
  adminErrInvalidLimit: string;
  adminErrNoRecipients: string;
  adminErrNoDevices: string;
  adminErrAlreadySent: string;
  adminErrLimitReached: string;
  adminErrSendFailed: string;
  notifTypeTip: string;
  notifTypeUpdate: string;
  notifSendTo: string;
  notifOpens: string;
  notifTest: string;
  notifContinue: string;
  notifTestSent: string;
  notifEnableAlerts: string;
  notifAlertsOn: string;
  notifAlertsBlocked: string;
  audSectionPeople: string;
  audEveryone: string;
  audPick: string;
  audPickHint: string;
  audEmailsLabel: string;
  audSectionRoadTax: string;
  audRoadTaxExpired: string;
  audRoadTaxSoon: string;
  audSectionActivity: string;
  audNew: string;
  audInactive: string;
  audNoVehicle: string;
  audSectionVehicle: string;
  audVehicle: string;
  audVehicleHint: string;
  audVehicleValue: string;
  audLanguage: string;
  audLanguageHint: string;
  audLanguageValue: string;
  audServiceOverdue: string;
  audLater: string;
  audDevices: string;
  audPeopleCount: string;
  audDone: string;
  confTitle: string;
  confNote: string;
  confLook: string;
  confType: string;
  confLanguages: string;
  confLanguagesValue: string;
  confBell: string;
  confSendsLeft: string;
  confSendsLeftValue: string;
  confUnknown: string;
  confTypeSend: string;
  confSendNow: string;
  histSent: string;
  histSending: string;
  histFailed: string;
  histAttempted: string;
  histDelivered: string;
  histTapped: string;
  histEmpty: string;
  histUsage: string;
  histChangeLimit: string;
  histLimitPrompt: string;
  histSentSuccess: string;

  // Announcements management
  adminAnnouncements: string;
  adminAnnouncementsHint: string;
  adminLogAnnouncementCreated: string;
  adminLogAnnouncementEdited: string;
  adminLogAnnouncementDeleted: string;
  annNew: string;
  annEdit: string;
  annEditAction: string;
  annTitle: string;
  annMessage: string;
  annType: string;
  annPriority: string;
  annVersion: string;
  annShowToUsers: string;
  annSave: string;
  annHide: string;
  annShow: string;
  annDelete: string;
  annConfirmDelete: string;
  annStatusShowing: string;
  annStatusHidden: string;
  annEmpty: string;
  annNote: string;
  annTypeFeature: string;
  annTypeUpdate: string;
  annTypeMaintenance: string;
  annTypeInfo: string;
  annPriorityLow: string;
  annPriorityMedium: string;
  annPriorityHigh: string;
  annErrInvalid: string;
  annErrMissing: string;

  // Notification settings and scheduled sends
  prefsTitle: string;
  prefsDeviceHeading: string;
  prefsDeviceOn: string;
  prefsDeviceOff: string;
  prefsDeviceBlocked: string;
  prefsDeviceUnsupported: string;
  prefsTurnOn: string;
  prefsTypesHeading: string;
  prefsRoadTax: string;
  prefsRoadTaxHint: string;
  prefsTipHint: string;
  prefsUpdateHint: string;
  prefsPromotionHint: string;
  prefsNote: string;
  prefsSaveError: string;
  notifTypePromotion: string;
  notifWhen: string;
  notifWhenNow: string;
  notifWhenLater: string;
  notifWhenPick: string;
  audPrefsNote: string;
  audDevicesLabel: string;
  confSendsLeftThatDay: string;
  confTitleScheduled: string;
  confWhen: string;
  confSchedule: string;
  confScheduledNote: string;
  histScheduled: string;
  histCancelled: string;
  histCancelSend: string;
  histConfirmCancel: string;
  histScheduledSuccess: string;
  adminLogNotificationScheduled: string;
  adminLogScheduledDetail: string;
  adminLogNotificationCancelled: string;
  adminErrInvalidSchedule: string;
  adminErrNotScheduled: string;
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
    manageVehicles: 'Manage vehicles',
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

    // Splash Screen
    splashLoadingData: 'Loading your data',

    // Overview
    nextService: 'Next Service',
    vehicleInfo: 'Vehicle Info',
    recentServiceHistory: 'Recent Service History',
    viewAll: 'View All',

    // Service History
    searchRecords: 'Search by description or notes...',
    noSearchResults: 'No records match your search.',

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

    // Road tax alerts & renewal
    roadTaxExpiredTitle: 'Road tax expired',
    roadTaxSoonTitle: 'Road tax expiring soon',
    roadTaxExpiredAgo: 'Expired {days} days ago ({date})',
    roadTaxExpiredYesterday: 'Expired yesterday ({date})',
    roadTaxExpiresToday: 'Expires today ({date})',
    roadTaxExpiresTomorrow: 'Expires tomorrow ({date})',
    roadTaxExpiresIn: 'Expires in {days} days ({date})',
    renew: 'Renew',
    renewNow: 'Renew now',
    renewRoadTax: 'Renew Road Tax',
    renewRoadTaxSummary: '{expired} expired, {soon} expiring soon',
    needsAction: 'Needs action',
    roadTaxAlertsStay: 'These stay here until the road tax is renewed.',
    newExpiryDate: 'New expiry date',
    newExpiryHint: 'Pre-filled: 1 year after the old expiry. Tap to change.',
    expiryMustBeFuture: 'New expiry date must be after today.',
    roadTaxRenewedUntil: 'Road tax renewed until {date}',
    saveNewDate: 'Save new date',
    failedRenewRoadTax: 'Failed to save the new road tax date. Please try again.',
    roadTaxNotifyExpiredTitle: 'Road tax expired: {name}',
    roadTaxNotifyExpiredBody: '{vehicle} road tax expired on {date}. Tap to renew in the app.',
    roadTaxNotifySoonTitle: 'Road tax expiring soon: {name}',
    roadTaxNotifySoonBody: '{vehicle} road tax expires on {date}. Renew early to avoid a fine.',
    remindTomorrow: 'Remind me tomorrow',
    notifyPromptTitle: 'Turn on phone alerts?',
    notifyPromptBody: 'Get road tax reminders and service tips, even when the app is closed. You can choose which ones in Settings.',
    allow: 'Allow',
    notNow: 'Not now',

    // Sign-in: Google, forgot password, email verification
    continueWithGoogle: 'Continue with Google',
    orDivider: 'or',
    forgotPassword: 'Forgot password?',
    invalidLoginHint: 'Invalid email or password. If you have used Google before, try Continue with Google, or use Forgot password.',
    resetPasswordTitle: 'Reset your password',
    resetPasswordHint: "Enter your email and we'll send you a link to set a new password.",
    sendResetLink: 'Send reset link',
    backToLogin: 'Back to log in',
    resetLinkSent: 'If that email has an account, a reset link is on its way. Check your spam folder too.',
    enterYourEmail: 'Please enter your email.',
    invalidEmail: 'That email address is not valid.',
    googleSignInFailed: 'Google sign-in did not work. Please try again.',
    googleAccountExists: 'This email already has an account. Log in with your password, then connect Google from Settings.',
    googleAlreadyLinked: 'That Google account is already used by another MyMotoLog account.',
    tooManyAttempts: 'Too many attempts. Please wait a few minutes and try again.',
    authNetworkError: 'No connection. Check your internet and try again.',
    verifyEmailTitle: 'Verify your email',
    verifyEmailBody: 'Confirm that {email} is yours, so you can always recover your account.',
    sendVerifyLink: 'Send link',
    verifyLinkSent: 'Link sent. Check your inbox and spam folder, then tap the link.',
    iveVerified: "I've verified",
    notVerifiedYet: 'Not verified yet. Tap the link in the email first.',
    verifyEmailFailed: 'Could not send the email. Please try again in a few minutes.',
    emailVerifiedDone: 'Email verified',
    googleAccount: 'Google account',
    googleConnected: 'Connected',
    googleNotConnected: 'Not connected',
    connect: 'Connect',

    // Roles
    accountRole: 'Role',
    roleAdmin: 'Admin',
    roleSuperadmin: 'Superadmin',

    // Admin panel
    adminPanel: 'Admin panel',
    adminBack: 'Back',
    adminRetry: 'Try again',
    adminCancel: 'Cancel',
    adminYes: 'Yes',
    adminNo: 'No',
    adminYou: 'You',
    adminStatUsers: 'Users',
    adminStatVehicles: 'Vehicles',
    adminStatDevices: 'Devices with alerts on',
    adminStatRoadTaxExpired: 'Road tax expired',
    adminSuperadminOnly: 'Superadmin only',
    adminManageTeam: 'Manage admins',
    adminCountHint: 'Admins: {count}',
    adminUsers: 'Users',
    adminUsersHint: 'Find or disable',
    adminActivity: 'Activity log',
    adminActivityHint: 'Who did what',
    adminAddTitle: 'Add an admin',
    adminFind: 'Find',
    adminAddHint: 'Enter their full email. The person must register first, and their email must be verified.',
    adminEmailVerified: 'Email verified',
    adminJoinedVia: 'Joined {date} · {methods}',
    adminMake: 'Make admin',
    adminConfirmMake: 'Make {email} an admin?',
    adminMadeSuccess: '{email} is now an admin. They get access the next time they open the app.',
    adminConfirmRemove: 'Remove {email} as admin? They will be signed out.',
    adminRemovedSuccess: '{email} is no longer an admin.',
    adminCurrentTeam: 'Current team',
    adminAddedOn: 'Added {date}',
    adminRemove: 'Remove',
    adminTeamNote: 'Removing an admin blocks their admin access straight away and signs them out the next time their app connects. Superadmin can\'t be added or removed here.',
    adminFindByEmail: 'Find by email',
    adminNoUsers: 'No users found.',
    adminShowingSome: 'Showing {shown} of {total}. Type more of the email to narrow it down.',
    adminStatusActive: 'Active',
    adminStatusDisabled: 'Disabled',
    adminJoined: 'Joined',
    adminLastSignIn: 'Last sign-in',
    adminSignInMethods: 'Sign-in methods',
    adminEmailVerifiedLabel: 'Email verified',
    adminProviderPassword: 'Password',
    adminPrivateNote: 'Private: vehicle details and service records aren\'t shown, even to superadmin.',
    adminEnable: 'Enable account',
    adminDisable: 'Disable account',
    adminDisableReason: 'Reason for disabling',
    adminReasonRequired: 'Please enter a reason.',
    adminConfirmEnable: 'Enable {email} again?',
    adminDisableNote: 'Disabling blocks sign-in and removes their alerts. It asks for a reason, and it can be undone. It doesn\'t delete their data.',
    adminFilterAll: 'All',
    adminFilterRoles: 'Roles',
    adminFilterUsers: 'Users',
    adminNoActivity: 'Nothing here yet.',
    adminReasonPrefix: 'Reason',
    adminLogNote: 'Written only by the server. Nobody can edit or delete it from the app.',
    adminLogRoleAdded: 'Made admin',
    adminLogRoleRemoved: 'Removed admin',
    adminLogUserDisabled: 'Disabled a user',
    adminLogUserEnabled: 'Enabled a user',
    adminErrNoAccess: 'You no longer have access to this.',
    adminErrUserNotFound: 'No account with that email. They need to register first.',
    adminErrQueryTooShort: 'Type at least 3 characters.',
    adminErrSelf: 'You can\'t change your own account here.',
    adminErrSuperadmin: 'Superadmin can\'t be changed here.',
    adminErrAlreadyAdmin: 'This person is already an admin.',
    adminErrNotAdmin: 'This person is not an admin.',
    adminErrNotVerified: 'Email not verified yet',
    adminErrUserDisabled: 'This account is disabled.',
    adminErrRemoveRoleFirst: 'Remove their admin role first.',
    adminErrAlreadyDisabled: 'This account is already disabled.',
    adminErrNotDisabled: 'This account is not disabled.',
    adminErrGeneric: 'Something went wrong. Check your connection and try again.',

    // Admin notifications
    adminNewNotification: 'New notification',
    adminManage: 'Manage',
    adminSendHistory: 'Send history',
    adminSendHistoryHint: 'What was sent',
    adminSendNotification: 'Send notification',
    adminFilterSends: 'Sends',
    adminLogNotificationSent: 'Sent "{title}"',
    adminLogNotificationDetail: 'To {audience}, {devices} devices',
    adminLogLimitChanged: 'Changed daily send limit',
    adminLogLimitDetail: 'From {from} to {to} a day',
    adminErrInvalidAudience: 'Check who this is going to. You can pick up to 20 full emails.',
    adminErrInvalidContent: 'Fill in the title and message in both languages.',
    adminErrInvalidLimit: 'Enter a whole number from 1 to 20.',
    adminErrNoRecipients: 'Nobody is in this group right now.',
    adminErrNoDevices: 'This account has no device with alerts on.',
    adminErrAlreadySent: 'This notification was already sent. Check Send history.',
    adminErrLimitReached: 'The daily send limit has been reached. Try again tomorrow.',
    adminErrSendFailed: 'The send stopped partway. Check Send history before trying again, as some people may already have it.',
    notifTypeTip: 'Service tip',
    notifTypeUpdate: 'App update',
    notifSendTo: 'Send to',
    notifOpens: 'Opens',
    notifTest: 'Send test to me',
    notifContinue: 'Continue',
    notifTestSent: 'Test sent to your devices: {count}. It does not appear in any bell or in history.',
    notifEnableAlerts: 'Turn on alerts on this device',
    notifAlertsOn: 'Alerts are on. Tap Send test to me again.',
    notifAlertsBlocked: 'Alerts could not be turned on. Allow notifications for this app in your browser or phone settings.',
    audSectionPeople: 'People',
    audEveryone: 'Everyone',
    audPick: 'One or a few users',
    audPickHint: 'By email',
    audEmailsLabel: 'Full emails, one per line (up to 20)',
    audSectionRoadTax: 'Road tax',
    audRoadTaxExpired: 'Road tax expired',
    audRoadTaxSoon: 'Expiring within 30 days',
    audSectionActivity: 'Activity',
    audNew: 'New in the last 30 days',
    audInactive: 'Inactive for 60 days',
    audNoVehicle: 'No vehicle added yet',
    audSectionVehicle: 'Vehicle and language',
    audVehicle: 'Vehicle type contains',
    audVehicleHint: 'e.g. Honda',
    audVehicleValue: 'Vehicle type: {text}',
    audLanguage: 'Language',
    audLanguageHint: 'EN or BM',
    audLanguageValue: 'Language: {language}',
    audServiceOverdue: 'Service overdue',
    audLater: 'Later',
    audDevices: 'Devices: {count}',
    audPeopleCount: 'People: {count}',
    audDone: 'Done',
    confTitle: 'Send to {count} devices?',
    confNote: 'A notification can\'t be taken back once it\'s sent.',
    confLook: 'How it will look',
    confType: 'Type',
    confLanguages: 'Languages',
    confLanguagesValue: '{en} EN, {ms} BM',
    confBell: 'Also added to the bell',
    confSendsLeft: 'Sends left today',
    confSendsLeftValue: '{left} of {limit}',
    confUnknown: 'No account found, so these will be skipped: {emails}',
    confTypeSend: 'Sending to everyone: type SEND to confirm',
    confSendNow: 'Send now',
    histSent: 'Sent',
    histSending: 'Sending',
    histFailed: 'Failed',
    histAttempted: 'Attempted',
    histDelivered: 'Delivered to FCM',
    histTapped: 'Tapped',
    histEmpty: 'Nothing has been sent yet.',
    histUsage: 'Group sends today: {used} of {limit}',
    histChangeLimit: 'Change limit',
    histLimitPrompt: 'Group sends allowed per day (1 to 20)',
    histSentSuccess: 'Sent. People: {people}, devices: {devices}.',

    // Announcements management
    adminAnnouncements: 'Announcements',
    adminAnnouncementsHint: 'Showing: {count}',
    adminLogAnnouncementCreated: 'Created announcement',
    adminLogAnnouncementEdited: 'Edited announcement',
    adminLogAnnouncementDeleted: 'Deleted announcement',
    annNew: 'New announcement',
    annEdit: 'Edit announcement',
    annEditAction: 'Edit',
    annTitle: 'Title',
    annMessage: 'Message',
    annType: 'Type',
    annPriority: 'Priority',
    annVersion: 'Version (optional)',
    annShowToUsers: 'Show to users',
    annSave: 'Save',
    annHide: 'Hide',
    annShow: 'Show',
    annDelete: 'Delete',
    annConfirmDelete: 'Delete "{title}"? This can\'t be undone. Use Hide if you may want it back.',
    annStatusShowing: 'Showing',
    annStatusHidden: 'Hidden',
    annEmpty: 'No announcements yet.',
    annNote: 'Changes reach everyone\'s bell straight away, with no phone notification. People who already read one won\'t be told again if you edit it.',
    annTypeFeature: 'Feature',
    annTypeUpdate: 'Update',
    annTypeMaintenance: 'Maintenance',
    annTypeInfo: 'Info',
    annPriorityLow: 'Low',
    annPriorityMedium: 'Medium',
    annPriorityHigh: 'High',
    annErrInvalid: 'Fill in the title and message.',
    annErrMissing: 'This announcement no longer exists.',

    // Notification settings and scheduled sends
    prefsTitle: 'Notifications',
    prefsDeviceHeading: 'This device',
    prefsDeviceOn: 'Phone alerts are on for this device.',
    prefsDeviceOff: 'Phone alerts are off for this device.',
    prefsDeviceBlocked: 'Phone alerts are blocked. To turn them on, allow notifications for this app in your browser or phone settings, then reopen the app.',
    prefsDeviceUnsupported: 'This browser can\'t show phone alerts. On iPhone, add the app to your Home Screen first, then open it from there.',
    prefsTurnOn: 'Turn on phone alerts',
    prefsTypesHeading: 'What you receive',
    prefsRoadTax: 'Road tax alerts',
    prefsRoadTaxHint: 'Phone alerts before and after your road tax expires',
    prefsTipHint: 'Maintenance advice for your motorcycle',
    prefsUpdateHint: 'New features and important changes',
    prefsPromotionHint: 'Offers and deals. Off unless you turn it on',
    prefsNote: 'These apply to all your devices. Turning off a type also keeps it out of your bell, except road tax, which always shows in the app.',
    prefsSaveError: 'Could not save. Check your connection and try again.',
    notifTypePromotion: 'Promotion',
    notifWhen: 'When',
    notifWhenNow: 'Send now',
    notifWhenLater: 'Schedule',
    notifWhenPick: 'Date and time',
    audDevicesLabel: 'Devices',
    audPrefsNote: 'These counts are before people\'s settings. The next step shows the real number for your notification type.',
    confSendsLeftThatDay: 'Sends left that day',
    confTitleScheduled: 'Schedule for {date}?',
    confWhen: 'When',
    confSchedule: 'Schedule',
    confScheduledNote: 'Goes out within 5 minutes of this time. The people are worked out again then, so the numbers may change. You can cancel it in Send history.',
    histScheduled: 'Scheduled',
    histCancelled: 'Cancelled',
    histCancelSend: 'Cancel send',
    histConfirmCancel: 'Cancel this scheduled notification?',
    histScheduledSuccess: 'Scheduled for {date}.',
    adminLogNotificationScheduled: 'Scheduled "{title}"',
    adminLogScheduledDetail: 'To {audience}, for {date}',
    adminLogNotificationCancelled: 'Cancelled "{title}"',
    adminErrInvalidSchedule: 'Pick a time at least 5 minutes from now and within 60 days.',
    adminErrNotScheduled: 'This send is no longer waiting, so it can\'t be cancelled.',
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
    manageVehicles: 'Urus kenderaan',
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

    // Splash Screen
    splashLoadingData: 'Memuatkan data anda',

    // Overview
    nextService: 'Servis Seterusnya',
    vehicleInfo: 'Maklumat Kenderaan',
    recentServiceHistory: 'Sejarah Servis Terkini',
    viewAll: 'Lihat Semua',

    // Service History
    searchRecords: 'Cari mengikut penerangan atau nota...',
    noSearchResults: 'Tiada rekod sepadan dengan carian anda.',

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

    // Road tax alerts & renewal
    roadTaxExpiredTitle: 'Cukai jalan tamat tempoh',
    roadTaxSoonTitle: 'Cukai jalan hampir tamat',
    roadTaxExpiredAgo: 'Tamat {days} hari lalu ({date})',
    roadTaxExpiredYesterday: 'Tamat semalam ({date})',
    roadTaxExpiresToday: 'Tamat hari ini ({date})',
    roadTaxExpiresTomorrow: 'Tamat esok ({date})',
    roadTaxExpiresIn: 'Tamat dalam {days} hari ({date})',
    renew: 'Perbaharui',
    renewNow: 'Perbaharui sekarang',
    renewRoadTax: 'Perbaharui Cukai Jalan',
    renewRoadTaxSummary: '{expired} tamat tempoh, {soon} hampir tamat',
    needsAction: 'Perlu tindakan',
    roadTaxAlertsStay: 'Ini kekal di sini sehingga cukai jalan diperbaharui.',
    newExpiryDate: 'Tarikh tamat baharu',
    newExpiryHint: 'Diisi awal: 1 tahun selepas tarikh tamat lama. Ketik untuk ubah.',
    expiryMustBeFuture: 'Tarikh tamat baharu mesti selepas hari ini.',
    roadTaxRenewedUntil: 'Cukai jalan diperbaharui sehingga {date}',
    saveNewDate: 'Simpan tarikh baharu',
    failedRenewRoadTax: 'Gagal menyimpan tarikh cukai jalan baharu. Sila cuba lagi.',
    roadTaxNotifyExpiredTitle: 'Cukai jalan tamat: {name}',
    roadTaxNotifyExpiredBody: 'Cukai jalan {vehicle} tamat pada {date}. Ketik untuk perbaharui dalam aplikasi.',
    roadTaxNotifySoonTitle: 'Cukai jalan hampir tamat: {name}',
    roadTaxNotifySoonBody: 'Cukai jalan {vehicle} tamat pada {date}. Perbaharui awal untuk elak saman.',
    remindTomorrow: 'Ingatkan esok',
    notifyPromptTitle: 'Aktifkan makluman telefon?',
    notifyPromptBody: 'Terima peringatan cukai jalan dan tip servis, walaupun aplikasi ditutup. Anda boleh pilih yang mana dalam Tetapan.',
    allow: 'Benarkan',
    notNow: 'Bukan sekarang',

    // Sign-in: Google, forgot password, email verification
    continueWithGoogle: 'Teruskan dengan Google',
    orDivider: 'atau',
    forgotPassword: 'Lupa kata laluan?',
    invalidLoginHint: 'E-mel atau kata laluan tidak sah. Jika anda pernah menggunakan Google, cuba Teruskan dengan Google, atau gunakan Lupa kata laluan.',
    resetPasswordTitle: 'Tetapkan semula kata laluan',
    resetPasswordHint: 'Masukkan e-mel anda dan kami akan hantar pautan untuk menetapkan kata laluan baharu.',
    sendResetLink: 'Hantar pautan',
    backToLogin: 'Kembali ke log masuk',
    resetLinkSent: 'Jika e-mel itu mempunyai akaun, pautan sedang dihantar. Semak juga folder spam anda.',
    enterYourEmail: 'Sila masukkan e-mel anda.',
    invalidEmail: 'Alamat e-mel itu tidak sah.',
    googleSignInFailed: 'Log masuk Google tidak berjaya. Sila cuba lagi.',
    googleAccountExists: 'E-mel ini sudah mempunyai akaun. Log masuk dengan kata laluan, kemudian sambungkan Google dari Tetapan.',
    googleAlreadyLinked: 'Akaun Google itu sudah digunakan oleh akaun MyMotoLog yang lain.',
    tooManyAttempts: 'Terlalu banyak percubaan. Sila tunggu beberapa minit dan cuba lagi.',
    authNetworkError: 'Tiada sambungan. Semak internet anda dan cuba lagi.',
    verifyEmailTitle: 'Sahkan e-mel anda',
    verifyEmailBody: 'Sahkan bahawa {email} milik anda, supaya anda sentiasa boleh memulihkan akaun anda.',
    sendVerifyLink: 'Hantar pautan',
    verifyLinkSent: 'Pautan dihantar. Semak peti masuk dan folder spam, kemudian ketik pautan itu.',
    iveVerified: 'Saya sudah sahkan',
    notVerifiedYet: 'Belum disahkan. Ketik pautan dalam e-mel dahulu.',
    verifyEmailFailed: 'Tidak dapat menghantar e-mel. Sila cuba lagi selepas beberapa minit.',
    emailVerifiedDone: 'E-mel disahkan',
    googleAccount: 'Akaun Google',
    googleConnected: 'Disambungkan',
    googleNotConnected: 'Belum disambungkan',
    connect: 'Sambung',

    // Roles
    accountRole: 'Peranan',
    roleAdmin: 'Admin',
    roleSuperadmin: 'Superadmin',

    // Admin panel
    adminPanel: 'Panel admin',
    adminBack: 'Kembali',
    adminRetry: 'Cuba lagi',
    adminCancel: 'Batal',
    adminYes: 'Ya',
    adminNo: 'Tidak',
    adminYou: 'Anda',
    adminStatUsers: 'Pengguna',
    adminStatVehicles: 'Kenderaan',
    adminStatDevices: 'Peranti dengan makluman aktif',
    adminStatRoadTaxExpired: 'Cukai jalan tamat',
    adminSuperadminOnly: 'Superadmin sahaja',
    adminManageTeam: 'Urus admin',
    adminCountHint: 'Admin: {count}',
    adminUsers: 'Pengguna',
    adminUsersHint: 'Cari atau nyahaktif',
    adminActivity: 'Log aktiviti',
    adminActivityHint: 'Siapa buat apa',
    adminAddTitle: 'Tambah admin',
    adminFind: 'Cari',
    adminAddHint: 'Masukkan e-mel penuh. Orang itu mesti mendaftar dahulu, dan e-melnya mesti disahkan.',
    adminEmailVerified: 'E-mel disahkan',
    adminJoinedVia: 'Sertai {date} · {methods}',
    adminMake: 'Jadikan admin',
    adminConfirmMake: 'Jadikan {email} admin?',
    adminMadeSuccess: '{email} kini admin. Akses diberi apabila dia membuka aplikasi nanti.',
    adminConfirmRemove: 'Buang {email} sebagai admin? Dia akan dilog keluar.',
    adminRemovedSuccess: '{email} bukan lagi admin.',
    adminCurrentTeam: 'Pasukan semasa',
    adminAddedOn: 'Ditambah {date}',
    adminRemove: 'Buang',
    adminTeamNote: 'Membuang admin menyekat akses adminnya serta-merta dan melog keluar apabila aplikasinya bersambung nanti. Superadmin tidak boleh ditambah atau dibuang di sini.',
    adminFindByEmail: 'Cari ikut e-mel',
    adminNoUsers: 'Tiada pengguna dijumpai.',
    adminShowingSome: 'Menunjukkan {shown} daripada {total}. Taip lebih banyak e-mel untuk kecilkan carian.',
    adminStatusActive: 'Aktif',
    adminStatusDisabled: 'Dinyahaktif',
    adminJoined: 'Sertai',
    adminLastSignIn: 'Log masuk terakhir',
    adminSignInMethods: 'Cara log masuk',
    adminEmailVerifiedLabel: 'E-mel disahkan',
    adminProviderPassword: 'Kata laluan',
    adminPrivateNote: 'Peribadi: butiran kenderaan dan rekod servis tidak ditunjukkan, walaupun kepada superadmin.',
    adminEnable: 'Aktifkan akaun',
    adminDisable: 'Nyahaktif akaun',
    adminDisableReason: 'Sebab dinyahaktif',
    adminReasonRequired: 'Sila masukkan sebab.',
    adminConfirmEnable: 'Aktifkan semula {email}?',
    adminDisableNote: 'Nyahaktif menyekat log masuk dan membuang makluman pengguna. Sebab diperlukan, dan ia boleh dibatalkan. Data pengguna tidak dipadam.',
    adminFilterAll: 'Semua',
    adminFilterRoles: 'Peranan',
    adminFilterUsers: 'Pengguna',
    adminNoActivity: 'Belum ada apa-apa.',
    adminReasonPrefix: 'Sebab',
    adminLogNote: 'Ditulis oleh pelayan sahaja. Tiada sesiapa boleh mengubah atau memadamnya dari aplikasi.',
    adminLogRoleAdded: 'Dijadikan admin',
    adminLogRoleRemoved: 'Dibuang sebagai admin',
    adminLogUserDisabled: 'Nyahaktif pengguna',
    adminLogUserEnabled: 'Aktifkan pengguna',
    adminErrNoAccess: 'Anda tiada akses lagi untuk ini.',
    adminErrUserNotFound: 'Tiada akaun dengan e-mel itu. Dia perlu mendaftar dahulu.',
    adminErrQueryTooShort: 'Taip sekurang-kurangnya 3 aksara.',
    adminErrSelf: 'Anda tidak boleh mengubah akaun sendiri di sini.',
    adminErrSuperadmin: 'Superadmin tidak boleh diubah di sini.',
    adminErrAlreadyAdmin: 'Orang ini sudah menjadi admin.',
    adminErrNotAdmin: 'Orang ini bukan admin.',
    adminErrNotVerified: 'E-mel belum disahkan',
    adminErrUserDisabled: 'Akaun ini dinyahaktif.',
    adminErrRemoveRoleFirst: 'Buang peranan adminnya dahulu.',
    adminErrAlreadyDisabled: 'Akaun ini sudah dinyahaktif.',
    adminErrNotDisabled: 'Akaun ini tidak dinyahaktif.',
    adminErrGeneric: 'Ada masalah. Semak sambungan anda dan cuba lagi.',

    // Admin notifications
    adminNewNotification: 'Notifikasi baharu',
    adminManage: 'Urus',
    adminSendHistory: 'Sejarah penghantaran',
    adminSendHistoryHint: 'Apa yang dihantar',
    adminSendNotification: 'Hantar notifikasi',
    adminFilterSends: 'Hantaran',
    adminLogNotificationSent: 'Menghantar "{title}"',
    adminLogNotificationDetail: 'Kepada {audience}, {devices} peranti',
    adminLogLimitChanged: 'Mengubah had penghantaran harian',
    adminLogLimitDetail: 'Daripada {from} kepada {to} sehari',
    adminErrInvalidAudience: 'Semak penerima. Anda boleh pilih sehingga 20 e-mel penuh.',
    adminErrInvalidContent: 'Isi tajuk dan mesej dalam kedua-dua bahasa.',
    adminErrInvalidLimit: 'Masukkan nombor bulat dari 1 hingga 20.',
    adminErrNoRecipients: 'Tiada sesiapa dalam kumpulan ini sekarang.',
    adminErrNoDevices: 'Akaun ini tiada peranti dengan makluman aktif.',
    adminErrAlreadySent: 'Notifikasi ini sudah dihantar. Semak Sejarah penghantaran.',
    adminErrLimitReached: 'Had penghantaran harian telah dicapai. Cuba lagi esok.',
    adminErrSendFailed: 'Penghantaran terhenti separuh jalan. Semak Sejarah penghantaran sebelum cuba lagi, kerana sesetengah orang mungkin sudah menerimanya.',
    notifTypeTip: 'Tip servis',
    notifTypeUpdate: 'Kemas kini aplikasi',
    notifSendTo: 'Hantar kepada',
    notifOpens: 'Membuka',
    notifTest: 'Hantar ujian kepada saya',
    notifContinue: 'Teruskan',
    notifTestSent: 'Ujian dihantar ke peranti anda: {count}. Ia tidak muncul dalam loceng atau sejarah.',
    notifEnableAlerts: 'Aktifkan makluman pada peranti ini',
    notifAlertsOn: 'Makluman aktif. Ketik Hantar ujian kepada saya sekali lagi.',
    notifAlertsBlocked: 'Makluman tidak dapat diaktifkan. Benarkan notifikasi untuk aplikasi ini dalam tetapan pelayar atau telefon.',
    audSectionPeople: 'Orang',
    audEveryone: 'Semua orang',
    audPick: 'Seorang atau beberapa pengguna',
    audPickHint: 'Ikut e-mel',
    audEmailsLabel: 'E-mel penuh, satu setiap baris (sehingga 20)',
    audSectionRoadTax: 'Cukai jalan',
    audRoadTaxExpired: 'Cukai jalan tamat',
    audRoadTaxSoon: 'Tamat dalam 30 hari',
    audSectionActivity: 'Aktiviti',
    audNew: 'Baharu dalam 30 hari lepas',
    audInactive: 'Tidak aktif selama 60 hari',
    audNoVehicle: 'Belum tambah kenderaan',
    audSectionVehicle: 'Kenderaan dan bahasa',
    audVehicle: 'Jenis kenderaan mengandungi',
    audVehicleHint: 'cth. Honda',
    audVehicleValue: 'Jenis kenderaan: {text}',
    audLanguage: 'Bahasa',
    audLanguageHint: 'EN atau BM',
    audLanguageValue: 'Bahasa: {language}',
    audServiceOverdue: 'Servis tertunggak',
    audLater: 'Kemudian',
    audDevices: 'Peranti: {count}',
    audPeopleCount: 'Orang: {count}',
    audDone: 'Selesai',
    confTitle: 'Hantar ke {count} peranti?',
    confNote: 'Notifikasi tidak boleh ditarik balik selepas dihantar.',
    confLook: 'Rupa notifikasi',
    confType: 'Jenis',
    confLanguages: 'Bahasa',
    confLanguagesValue: '{en} EN, {ms} BM',
    confBell: 'Turut ditambah ke loceng',
    confSendsLeft: 'Baki hantaran hari ini',
    confSendsLeftValue: '{left} daripada {limit}',
    confUnknown: 'Tiada akaun dijumpai, jadi ini akan dilangkau: {emails}',
    confTypeSend: 'Menghantar kepada semua orang: taip SEND untuk sahkan',
    confSendNow: 'Hantar sekarang',
    histSent: 'Dihantar',
    histSending: 'Sedang dihantar',
    histFailed: 'Gagal',
    histAttempted: 'Dicuba',
    histDelivered: 'Diterima FCM',
    histTapped: 'Diketik',
    histEmpty: 'Belum ada apa-apa dihantar.',
    histUsage: 'Hantaran kumpulan hari ini: {used} daripada {limit}',
    histChangeLimit: 'Ubah had',
    histLimitPrompt: 'Hantaran kumpulan dibenarkan sehari (1 hingga 20)',
    histSentSuccess: 'Dihantar. Orang: {people}, peranti: {devices}.',

    // Announcements management
    adminAnnouncements: 'Pengumuman',
    adminAnnouncementsHint: 'Dipaparkan: {count}',
    adminLogAnnouncementCreated: 'Mencipta pengumuman',
    adminLogAnnouncementEdited: 'Mengubah pengumuman',
    adminLogAnnouncementDeleted: 'Memadam pengumuman',
    annNew: 'Pengumuman baharu',
    annEdit: 'Ubah pengumuman',
    annEditAction: 'Ubah',
    annTitle: 'Tajuk',
    annMessage: 'Mesej',
    annType: 'Jenis',
    annPriority: 'Keutamaan',
    annVersion: 'Versi (pilihan)',
    annShowToUsers: 'Papar kepada pengguna',
    annSave: 'Simpan',
    annHide: 'Sorok',
    annShow: 'Papar',
    annDelete: 'Padam',
    annConfirmDelete: 'Padam "{title}"? Ini tidak boleh dibatalkan. Guna Sorok jika mungkin mahu ia semula.',
    annStatusShowing: 'Dipaparkan',
    annStatusHidden: 'Disorok',
    annEmpty: 'Belum ada pengumuman.',
    annNote: 'Perubahan terus sampai ke loceng semua orang, tanpa notifikasi telefon. Orang yang sudah membacanya tidak dimaklumkan lagi jika anda mengubahnya.',
    annTypeFeature: 'Ciri',
    annTypeUpdate: 'Kemas kini',
    annTypeMaintenance: 'Penyelenggaraan',
    annTypeInfo: 'Maklumat',
    annPriorityLow: 'Rendah',
    annPriorityMedium: 'Sederhana',
    annPriorityHigh: 'Tinggi',
    annErrInvalid: 'Isi tajuk dan mesej.',
    annErrMissing: 'Pengumuman ini sudah tiada.',

    // Notification settings and scheduled sends
    prefsTitle: 'Notifikasi',
    prefsDeviceHeading: 'Peranti ini',
    prefsDeviceOn: 'Makluman telefon aktif pada peranti ini.',
    prefsDeviceOff: 'Makluman telefon tidak aktif pada peranti ini.',
    prefsDeviceBlocked: 'Makluman telefon disekat. Untuk mengaktifkannya, benarkan notifikasi untuk aplikasi ini dalam tetapan pelayar atau telefon, kemudian buka semula aplikasi.',
    prefsDeviceUnsupported: 'Pelayar ini tidak boleh memaparkan makluman telefon. Pada iPhone, tambah aplikasi ke Skrin Utama dahulu, kemudian buka dari situ.',
    prefsTurnOn: 'Aktifkan makluman telefon',
    prefsTypesHeading: 'Apa yang anda terima',
    prefsRoadTax: 'Makluman cukai jalan',
    prefsRoadTaxHint: 'Makluman telefon sebelum dan selepas cukai jalan tamat',
    prefsTipHint: 'Nasihat penyelenggaraan motosikal anda',
    prefsUpdateHint: 'Ciri baharu dan perubahan penting',
    prefsPromotionHint: 'Tawaran dan promosi. Tidak aktif kecuali anda aktifkan',
    prefsNote: 'Tetapan ini untuk semua peranti anda. Mematikan sesuatu jenis juga mengeluarkannya dari loceng, kecuali cukai jalan yang sentiasa dipaparkan dalam aplikasi.',
    prefsSaveError: 'Tidak dapat disimpan. Semak sambungan anda dan cuba lagi.',
    notifTypePromotion: 'Promosi',
    notifWhen: 'Bila',
    notifWhenNow: 'Hantar sekarang',
    notifWhenLater: 'Jadualkan',
    notifWhenPick: 'Tarikh dan masa',
    audDevicesLabel: 'Peranti',
    audPrefsNote: 'Kiraan ini sebelum mengambil kira tetapan pengguna. Langkah seterusnya menunjukkan bilangan sebenar untuk jenis notifikasi anda.',
    confSendsLeftThatDay: 'Baki hantaran hari itu',
    confTitleScheduled: 'Jadualkan pada {date}?',
    confWhen: 'Bila',
    confSchedule: 'Jadualkan',
    confScheduledNote: 'Dihantar dalam masa 5 minit dari waktu ini. Penerima dikira semula pada masa itu, jadi bilangannya mungkin berubah. Anda boleh membatalkannya dalam Sejarah penghantaran.',
    histScheduled: 'Dijadualkan',
    histCancelled: 'Dibatalkan',
    histCancelSend: 'Batal hantaran',
    histConfirmCancel: 'Batalkan notifikasi berjadual ini?',
    histScheduledSuccess: 'Dijadualkan pada {date}.',
    adminLogNotificationScheduled: 'Menjadualkan "{title}"',
    adminLogScheduledDetail: 'Kepada {audience}, pada {date}',
    adminLogNotificationCancelled: 'Membatalkan "{title}"',
    adminErrInvalidSchedule: 'Pilih masa sekurang-kurangnya 5 minit dari sekarang dan dalam 60 hari.',
    adminErrNotScheduled: 'Hantaran ini tidak lagi menunggu, jadi ia tidak boleh dibatalkan.',
  },
};

export const getTranslation = (lang: Language): Translations => {
  return translations[lang];
};
