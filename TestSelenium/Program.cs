using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using Utils;

Console.Write("Please enter the operation you want [1]Test Login: ");
int op = System.Convert.ToInt32(Console.ReadLine());
Console.WriteLine(op);

Console.Write("Please enter the number of Tests you want: ");
int n = System.Convert.ToInt32(Console.ReadLine());
Console.WriteLine(n);


IWebDriver driver = BrowserUtils.StartBrowser();

if (op == 1)
{
    string xPath = "//button[@class='bg-orange-500 flex min-w-[250px] cursor-pointer items-center gap-3 rounded-md p-3 text-white transition duration-300 hover:brightness-90 disabled:!cursor-default disabled:!brightness-75']";
    driver.Navigate().GoToUrl("https://socialhive.me/");
    for (int i = 0; i < n; i++)
    {
        System.Threading.Thread.Sleep(500);
        IWebElement button = driver.FindElement(By.XPath(xPath));
        button.Click();

        var emailInput = driver.FindElement(By.XPath("//input[@type='email']"));
        var passwordInput = driver.FindElement(By.XPath("//input[@type='password']"));

        emailInput.Click();
        emailInput.SendKeys("isgnadir@gmail.com");
        passwordInput.Click();
        passwordInput.SendKeys("nadir123");
        var submitBtn = driver.FindElement(By.XPath("//button[@type='submit']"));
        submitBtn.Click();

        System.Threading.Thread.Sleep(2000);

        var profileIcn = driver.FindElement(By.XPath("//img[@class='h-8 w-8 cursor-pointer rounded-full object-cover']"));
        profileIcn.Click();
        System.Threading.Thread.Sleep(1000);
        var signoutBtn = driver.FindElement(By.XPath("//i[@class='bx bx-log-out text-xl']"));
        signoutBtn.Click();
    }
}



driver.Dispose();