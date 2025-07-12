import { Plane, MessageCircleQuestion,Volleyball,MapPinHouse,House,ShieldAlert,Camera, Images,ChartColumnStacked, Rss, List, Home, Menu, X, Calendar, HomeIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../pictures/ArrivoLogo.webp";
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();


  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('appLanguage', newLang);
  };
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);
  



  const menuItems = [
    { label: t("homeBtn"), icon: HomeIcon, link: '/' },
    { label: t("ManageOneDay"), icon: List, link: '/oneday-trip' },
    { label: t("OneDayTrips"), icon: Plane, link: '/tripsOne' },
    { label: t("MultidayTrips"), icon: Plane, link: '/multi-trip' },
   
    { label: t("CommonQuestions"), icon: MessageCircleQuestion, link: '/common' },
    { label: t("TripContent"), icon: Rss, link: '/tripContent' },
    { label: t("TripActivities"), icon: Volleyball, link: '/tripsAct' },
    { label: t("Subtypes"), icon: ChartColumnStacked, link: '/subtypes' },
    { label: t("TripGallery"), icon: Images, link: '/gallery' },
    { label: t("Unavaliability"), icon: Calendar, link: '/unavdate' },
    { label: t("Destinations"), icon: MapPinHouse, link: '/destinations' },
    { label: t("Residences"), icon: House , link: '/residence' },
    { label: t("Subdestinations"), icon: Calendar, link: '/subDest' },
    { label: t("TripExclusions"), icon: ShieldAlert, link: '/tripsEx' },
    { label: t("LocationHighlights"), icon: Camera, link: '/visitLhighlights' },
    { label: t("Conditions"), icon: ShieldAlert, link: '/conditions' },
  ];



  

  return (
    <div
      className={`fixed ltr:left-0 rtl:right-0 top-0 h-full flex flex-col bg-white shadow-xl border-r border-gray-200 transition-all duration-300 z-50 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex  justify-between">
        {!collapsed && (
          <div className="flex  space-x-2">
            <div className="w-20 h-20  flex items-center justify-center ">
              <img src={logo} alt="Logo" className="w-20 h-30 rtl:mr-28 ltr:ml-28 mt-4" />
            </div>
         
          </div>
        )}
      
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation with scroll */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <nav>
          {menuItems.map(({ label, icon: Icon, link }) => {
            const isActive =
              link === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link);

            return (
              <button
                key={label}
                onClick={() => navigate(link)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#01011A] via-[#131863] to-[#DB940F] text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
                
              >
                <Icon className="w-5 h-5 rtl:ml-2" />
                {!collapsed && <span className="font-medium">{label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Help Box */}
      {!collapsed && (
        <div className="flex flex-col py-4">

<div className="p-4 m-4 rounded-lg border border-blue-200 bg-gradient-to-r from-[#01011A] via-[#131863] to-[#DB940F]">
          <h3 className="font-semibold text-white mb-1 " dir='ltr'>Powered By</h3>
          <p className="text-sm text-white" dir='ltr'>A3 Digital Solutions Agency</p>
        </div>

<div className="lang mx-auto">
<button
        onClick={toggleLanguage}
        className=" text-black  "
      >
        {t('change_lang')}
      </button>
</div>


        </div>
       
      )}
    </div>
  );
};
