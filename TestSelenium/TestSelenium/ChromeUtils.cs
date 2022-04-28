using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium.Chrome;
using System;

namespace Utils
{
    public static class BrowserUtils
    {
        public static IWebDriver StartBrowser()
        {
            var options = new ChromeOptions();
            options.AddArguments("--window-size=1920,1080");
            options.AddArguments("--disable-gpu");
            options.AddExcludedArgument("enable-logging");
            options.AddArguments("--start-maximized");
            //options.AddArguments("--headless");


            ChromeDriverService service = ChromeDriverService.CreateDefaultService();
            //service.SuppressInitialDiagnosticInformation = true;
            //service.HideCommandPromptWindow = true;

            var driver = new ChromeDriver(service, options);
            return driver;
        }


        public static void Wait(IWebDriver driver, string xpath)
        {
            //WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            //wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.ElementIsVisible(By.XPath(xpath)));
        }
    }
}