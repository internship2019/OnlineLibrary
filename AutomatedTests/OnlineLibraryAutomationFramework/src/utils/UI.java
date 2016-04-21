package utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;
import java.util.Random;

import org.apache.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;




public class UI  {

	static Properties prop = new Properties();
	
	public static WebDriver driver = new FirefoxDriver(); 
	
	Logger log = Logger.getLogger("devpinoyLogger");

																//declarations
	
	public void openAplication (String link){
		
		driver.get(link);
		log.debug("The aplication with the address:'"+link+"' has oppened in Firefox...");
		
	}

	public void closeAplication(){
		
		driver.close();
		log.debug("The aplication is closed...");
		
		
		
	}
	
	public void initializeXpathProp(){
		
		File file = new File("Properties/xpath.properties");
		  
		FileInputStream fileInput = null;
		try {
			fileInput = new FileInputStream(file);
			
		} catch (FileNotFoundException e) {
			
			e.printStackTrace();
		}
		
		try {
			prop.load(fileInput);
			
		} catch (IOException e) {
			
			e.printStackTrace();
		}
	
		log.debug("The 'xpath.properties' file was initialized with success...");
		
	}

	public void clickItem (String xpathProperty){
		
		waitElement(xpathProperty);
		driver.findElement(By.xpath(prop.getProperty(xpathProperty))).click();
		log.debug(xpathProperty + " was clicked");
		
		
		
	}
	
	public void clickItemByXpath (String xpath){
		
		watiElementByXpath(xpath);
		driver.findElement(By.xpath(xpath)).click();
		log.debug("element with the xpath: '"+ xpath + "' was clicked");
		
	}
	
	public void clickRandomBook(int nrOfBooksOnPage){
		
		Random generator = new Random(); 
		
		int i = generator.nextInt(nrOfBooksOnPage) + 1;
		
		clickItemByXpath("/html/body/div[2]/div[2]/div/div["+ i +"]/div/div/div[1]/a/img");
		
		log.debug("A random book was chosen from the list");
	
	}
	
	public void inputInto (String value, String element){
		
		waitElement(element);
		driver.findElement(By.xpath(prop.getProperty(element))).sendKeys(value);
		log.debug("The input data '"+value+ "' was successfuly added into '"+element+"' element...");
		
		
		
		
	}
	
	public void openLogFile(){
		
		ProcessBuilder pb = new ProcessBuilder("Notepad.exe", "log.logs");
		
		try {
			pb.start();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	
		System.out.println("The Created log file has openned...");
		
	
	}
	
	
	
	
	
	private static void waitElement(String element){
		
		WebDriverWait wait = new WebDriverWait(driver, 10);
		
		
		wait.until(ExpectedConditions.elementToBeClickable(By.xpath(prop.getProperty(element))));
		
		System.out.println(element + " has loaded...");
		
		
		
	}
	
	private static void watiElementByXpath (String xpath){
		
		WebDriverWait wait = new WebDriverWait(driver, 10);
		
		
		wait.until(ExpectedConditions.elementToBeClickable(By.xpath(xpath)));
		
		System.out.println("the element with the following xpath: '"+ xpath + "' has loaded...");
		
	}
	
	
}