import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      change_lang: "العربية",
      homeBtn:"Home",
      TripManagement :"Trip Management",

      ManageOneDay:"Manage 1 Day Trips",
      OneDayTrips:"One Day Trips",
      MultidayTrips:"Multiday Trips",
      CommonQuestions:"Common Quesitons",
      TripContent:"Trip Contnet",
      TripActivities:"Trip Activities",
      Subtypes:"Subtypes",
      TripGallery:"Trip Gallery",
      Unavaliability:"Unavaliability",
      Destinations:"Destinations",
      Residences:"Residences",
      Subdestinations:"Subdestinations",
      TripExclusions:"Trip Exclusions",
      LocationHighlights:"Location Highlights",
      Conditions:"Conditions",
      CreateOneDayTrip:"Create One Day Trip",
      ViewAll1DayTrips:"View All Trips",
      OneTripCrudInfo:"Fill in the trip details below to create a new one-day trip",
TripTitle:"Trip Title",
Tags: "Tags",
Hours: "Hours",
Price:"Price",
GroupSize:"Group Size",
OfferType:"Offer Type",
TripDescription:"Trip Description",
ManageTripsDescription:"Manage your travel packages and destinations",
SelectGalleryImages:"Select Gallery Images",
SelectQuestions:"Select Questions",
SelectProvinces:"Select Provinces",
SelectLocationHighlights:"Select Location Highlights",
SelectTripContent:"Select Trip Content",
SelectTripActivities:"Select Trip Activities",
SelectImportantInfo:"Select Important Info",
SelectTripExclusions:"Select Trip Exclusions",
SelectSubTypes:"Select Subtypes",
ChooseFile:"Choose Picture",
noFileSelected:"No File Selected",

EditPackage:"Edit Package",
ProgramSteps:"Program Steps",
Step:"Step",
SelectDestination:"Select Destination",
SelectSubDestination:"Select SubDestination",
AddProgramStep:" Add Program Step",
CreateTrip:"Create Trip",
EditTrip:" Edit Trip",
SelectDestinationFirst:"Select Destination First",
Remove:"Remove",
Delete:"Delete Trip",
Edit:"Edit Trip",
DeleteWarning:"Are you sure you want to delete this trip ? ",
ImportantField:"Please fill / select at least one . This a requriement ",
Cancel:"Canel",
AddItem:"Add Item",
EditItem:"Edit",

AddedSuccessfully:"Item Added Successfully!",
EditedSucessfully:"Item edited Successfully !",
DeletedSuccessfully:"Item Deleted Successfully !",
DeleteItem:"Delete",
TitleSingle:"Title",
DescriptionSingle:"Description",
WelcomingArrivo:"Welcome to Arrivo Travel Agency Dashboard  ",
Search:"Search ... ",
Username:"Username",
EnterUser:"Enter your username",
Password:"Password",
EnterPassword:"Enter your password",
Login:"Login To Arrivo",

Packages: "Pricing & Grouping" ,

PackagesInfo:"Create packages with different prices and group sizes for your trips easily !",
AvaliablePackages:"My packages" ,

WorkingPackages:"Currently created packages",

AvaliableTrips:"Avaliable Trips",

CreatePackage:"Create Package",


  Success: "Success!",
  LoginSuccess: "You have successfully logged in. Redirecting...",
  Loginfailed: "Login Failed",


 

InvalidCredentials: "Username / Password is incorrect",
  

Loading:"Loading....",

Subtitle:"Sub-title",

DurationDays:" Duaration (Days) ",



TripSingle:"Trip",

TripSelect:"Select A Trip ",

DateStart:"Date of Start ",

DateEnd:" Ending Date",


NoItems:"No added items in this page ",

CreateMessage:"Create items so they can appear.",


HelpMessage:"If you are sure you added items but can't see them, refresh the page or call A3 Digital Solutions Support Line.",

GoBackHome:"Go Back Home",

WeAppreicate:" We appreciate your patience. "

      
    },
  },
  ar: {
    translation: {
      welcome: "أهلاً وسهلاً",
      change_lang: "ENGLISH",


      AddedSuccessfully:"تمت اضافة العنصر بنجاح !",
EditedSucessfully:"تم تعديل العنصر بنجاح  !",
DeletedSuccessfully:"تم مسح العنصر بنجاح !",


      homeBtn:"الرئيسية",
      ManageOneDay:"ادارة الرحل اليومية",
      OneDayTrips:"الرحل اليومية",
      MultidayTrips:"البرامج السياحية",
      TripManagement:"ادارة الرحل",
      Search:"بحث ...",
      ManageTripsDescription : "قم بادارة الرحلات والبرامج بسهولة",
      CommonQuestions:"اسألة شائعة",
      TripContent:"محتويات الرحل",
      TripActivities:"نشاطات الرحل",
      Subtypes:"انواع الرحل ",
      TripGallery:"معرض الصور",
      Unavaliability:"جدول عدم التوفر",
      Destinations:"الوجهات",
      Residences:"أماكن الإقامات",
      Subdestinations:"وجهات -ثانوي",
      TripExclusions:"استثناء",
      LocationHighlights:"أماكن سوف تزورها",
      Conditions:"الأحكام",
      CreateOneDayTrip:"انشاء رحلة يوم واحد",
      ViewAll1DayTrips:"جميع رحلاتي",
      OneTripCrudInfo:"قم بملء تفاصيل الرحلة أدناه لإنشاء رحلة جديدة ليوم واحد",
      TripTitle: "عنوان الرحلة",
      DeleteWarning:"هل متأكد من حذف الرحلة ؟ ",
      Packages:"نظام التسعير ",
      PackagesInfo:"قم بتشكيل بكجات سياحية للبرامج مع التسعير والمجموعات بسهولة",
      DurationDays:" المدة بالايام ",
      AvaliablePackages:"البكجات الحالية" ,

WorkingPackages:"بكجات يتم تفعيلها",

AvaliableTrips:"الرحل المتوفرة",

CreatePackage:"بكج جديد",




Tags: "التاغات",
Hours: "الساعات",
Price: "السعر",

EditPackage:"تعديل يكج",

Loading:"جاري التحميل...",



TripSingle:"الرحلة",

TripSelect:"قم باختيار رحلة",

DateStart:"تاريخ البدأ",

DateEnd:"تاريخ الانتهاء",

GroupSize: "حجم المجموعة",
OfferType: "نوع العرض",
TripDescription: "وصف الرحلة",
SelectGalleryImages: "اختر صور المعرض",
SelectQuestions: "اختر الأسئلة",
SelectProvinces: "اختر المحافظات",
SelectLocationHighlights: "اختر أبرز المواقع",
SelectTripContent: "اختر محتوى الرحلة",
SelectTripActivities: "اختر أنشطة الرحلة",
SelectImportantInfo: "اختر المعلومات المهمة",
SelectTripExclusions: "اختر المستثنيات من الرحلة",
SelectSubTypes: "اختر الأنواع الفرعية",
ChooseFile: "اختر صورة",
noFileSelected: "لم يتم اختيار أي ملف",
ProgramSteps: "مراحل البرنامج",
Subtitle:"عنوان ثانوي",

Step: "المرحلة",
SelectDestination: "اختر الوجهة",
SelectSubDestination: "اختر الوجهة الفرعية",
SelectDestinationFirst: "اختر الوجهة الرئيسية اولا",
AddProgramStep: "إضافة مرحلة إلى البرنامج",
CreateTrip: "إنشاء رحلة",
EditTrip: "تعديل الرحلة",
Remove:"ازالة",
Delete:"مسح الرحلة",
Edit:"تعديل الرحلة",
ImportantField:"يرجى تعبئة او اختيار عنصر - حقل اجباري",
Cancel:"الغاء",
AddItem:"اضافة العنصر",
WeAppreicate:"شكرا نقدر انتظاركم ",



EditItem:"تعديل",
DeleteItem:"ازالة",
Question:"السؤال",
Answer:"الجواب",

TitleSingle:"العنوان",
DescriptionSingle:"التوصيف",
WelcomingArrivo:"اهلا بكم في لوحة التحكم الخاصة بشركة اريفو السياحية",
Username:"اسم المستخدم",
EnterUser:"ادخل اسم المستخدم",
Password:"كلمة السر",
EnterPassword:"ادخل كلمة السر",
Login:"تسجيل دخول للوحة التحكم ",
SignIn:"سجل دخول",



Success: "تم بنجاح ! ",
LoginSuccess: " تم تسجيل الدخول ، يتم تحويلكم الى لوحة التحكم .... ",
Loginfailed: "تعذر تسجيل الدخول !",

InvalidCredentials: "اسم المستخدم او كلمة المرور غير صحيحة ",



NoItems:"لا توجد عناصر تمت اضافتها سابقا في هذه الصفحة ",

CreateMessage:"قم باضافة عناصر حتى تتمكن من رؤيتها وتنظيمها",


HelpMessage:"اذا كنت متاكدا من اضافتك للعناصر سابفا لكن لا تراها الآن تواصل مع فريق A3 Digital Solutions .",

GoBackHome:"الذهاب الى الرئيسية",




    },
  },
};

// Load saved language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem('appLanguage') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
