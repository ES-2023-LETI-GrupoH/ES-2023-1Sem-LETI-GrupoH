import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import java.util.List;

public class Page {
    public static void setUpBeforeClass() throws Exception {
        //Find Drivers
        System.setProperty("webdriver.chrome.driver", "C:\\Users\\vb200\\git\\ES-2023-1Sem-LETI-GrupoH\\chromedriver-win64\\chromedriver.exe");
        // create a new instance of the driver
        driver = new ChromeDriver();
        driver.get(file:///"C:\\Users\\vb200\\git\\ES-2023-1Sem-LETI-GrupoH\\chromedriver-win64\\chromedriver.exe");
    }

    public static void remote(){
        @FindBy(css = "button[data-bs-toggle='modal']")
        public WebElement buttonModal;
        buttonModal.click();
        @FindBy(css = "select[id='csv-import-schedule'] option[value='url']")
        public WebElement optionUrl;
        optionUrl.sendKeys("https://raw.githubusercontent.com/ES-2023-LETI-GrupoH/ES-2023-1Sem-LETI-GrupoH/test/src/main/webapp/resources/minihorario.csv");
        @FindBy(css = "button[data-bs-target='#classroomModal']")
        public WebElement buttonClassroomModal;
        buttonClassroomModal.click();
        @FindBy(css = "select[id='csv-import-classroom'] option[value='url']")
        public WebElement optionUrl;
        optionUrl.sendKeys("https://raw.githubusercontent.com/ES-2023-LETI-GrupoH/ES-2023-1Sem-LETI-GrupoH/test/src/main/webapp/resources/minihorario.csv");
        @FindBy(css = "button[type='submit']")
        public WebElement buttonModal;
        buttonModal.click();
    }

   public Page(WebDriver driver) {
        PageFactory.initElements(driver, this);
    }

    public static void main(String[] args) {
        remote();
    }

}