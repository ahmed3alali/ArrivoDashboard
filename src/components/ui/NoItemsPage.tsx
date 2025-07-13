
import { t } from "i18next";
import logo from "../../pictures/ArrivoLogo.webp";
interface NoItemsPageProps {
    error?: boolean;
  }
  
  export default function NoItemsPage({ error = false }: NoItemsPageProps) {
    return (
      <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center max-w-xl">
          {/* Replace with your logo component or image */}
          <img src={logo} alt="Logo" className="mx-auto h-16 mb-6" />
  
          {error ? (
            <>
              <h1 className="text-2xl font-semibold text-red-600">
                An error occurred while fetching data.
              </h1>
              <p className="mt-4 text-base text-gray-600">
                Please try refreshing the page. If the problem persists, contact our support line at <strong>A3 Digital Solutions</strong> for backend support.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-gray-900">
           {t("NoItems")}
              </h1>
              <p className="mt-4 text-base text-gray-600">
            {t("CreateMessage")}
              </p>
              <p className="mt-2 text-sm text-gray-500">
{t("HelpMessage")}
              </p>
            </>
          )}
  
          <div className="mt-10 flex justify-center">
            <a
              href="/"
              className="rounded-md bg-gradient-to-r from-[#01011A] via-[#131863] to-[#DB940F] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
             {t("GoBackHome")}
            </a>
          </div>
        </div>
      </main>
    );
  }
  