const puppeteer = require('puppeteer');
const fs = require('fs');
var request = require('request');


const matchMaker=(async (boy,girl) => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ defaultViewport: null });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://www.prokerala.com/astrology/kundali-matching/');

  await page.type("#fin_gname","Priyanka Batra");

  const inputSelectorg = '#fin_glocation';
  await page.waitForSelector(inputSelectorg);

  // Clear the input field
  await page.$eval(inputSelectorg, input => input.value = '');
  
  await page.type("#fin_glocation","Delhi");



  // ############
  // autocomplete-suggestions
  // ----------------
  // await page.waitForSelector('#frmAstro > div > div.grid-col.grid-col-xs-12.grid-col-md-6.no-margin > div.person-data.girl-details.no-pad.profile-suggestion-loaded > fieldset > div.location-group-wrapper > div.autocomplete-suggestions > div:nth-child(1)'); 

  // // Select the first suggestion ("Delhi, Delhi, India")
  // await page.click('#frmAstro > div > div.grid-col.grid-col-xs-12.grid-col-md-6.no-margin > div.person-data.girl-details.no-pad.profile-suggestion-loaded > fieldset > div.location-group-wrapper > div.autocomplete-suggestions > div:nth-child(1)');
 

  await page.waitForFunction(() => {
    const suggestionsContainer = document.querySelector("#frmAstro > div > div.grid-col.grid-col-xs-12.grid-col-md-6.no-margin > div.person-data.girl-details.no-pad.profile-suggestion-loaded > fieldset > div.location-group-wrapper > div.autocomplete-suggestions");
    return suggestionsContainer && suggestionsContainer.children.length > 0;
  });
  
  const locationSelector = await page.evaluate(async () => {

    const elements = (document.querySelector("#frmAstro > div > div.grid-col.grid-col-xs-12.grid-col-md-6.no-margin > div.person-data.girl-details.no-pad.profile-suggestion-loaded > fieldset > div.location-group-wrapper > div.autocomplete-suggestions").childNodes);

    console.log(elements)
    console.log(elements.length)
    let desiredSelector = '';
    elements.forEach((element) => {
      if (element.getAttribute('data-location') === 'Delhi, Delhi, India') {

        desiredSelector = `#frmAstro > div > div.grid-col.grid-col-xs-12.grid-col-md-6.no-margin > div.person-data.girl-details.no-pad.profile-suggestion-loaded > fieldset > div.location-group-wrapper > div.autocomplete-suggestions [data-location="${element.getAttribute('data-location')}"]`; 
      }
    });

    return desiredSelector ;
  });
  console.log("girl",locationSelector);
  if (locationSelector) {
    await page.click(locationSelector);
  }
  



  await page.select("#fin_gyear","1996");
  await page.select("#fin_gmonth","1");
  await page.select("#fin_gday","11");
  await page.select("#fin_ghour","10");
  await page.select("#fin_gmin","40");
  await page.select("#fin_gapm","pm");
  
  await page.type("#fin_bname","Karan Arora");
  const inputSelectorb = '#fin_blocation';
  await page.waitForSelector(inputSelectorb);

  // Clear the input field
  await page.$eval(inputSelectorb, input => input.value = '');
  await page.type("#fin_blocation","Delhi");
  // //Delhi, Delhi, India



  await page.waitForFunction(() => {
    const suggestionsContainer = document.querySelector("#frmAstro > div > div.grid-col.grid-col-xs-12.grid-col-md-6.no-margin > div.person-data.boy-details.no-pad.profile-suggestion-loaded > fieldset > div.location-group-wrapper > div.autocomplete-suggestions")
    return suggestionsContainer && suggestionsContainer.children.length > 0;
  });
  
  const locationSelectorboy = await page.evaluate(async () => {

    const elements = (document.querySelector("#frmAstro > div > div.grid-col.grid-col-xs-12.grid-col-md-6.no-margin > div.person-data.boy-details.no-pad.profile-suggestion-loaded > fieldset > div.location-group-wrapper > div.autocomplete-suggestions").childNodes);

    console.log(elements)
    console.log(elements.length)
    let desiredSelector = '';
    elements.forEach((element) => {
      if (element.getAttribute('data-location') === 'Delhi, Delhi, India') {

        desiredSelector = `#frmAstro > div > div.grid-col.grid-col-xs-12.grid-col-md-6.no-margin > div.person-data.boy-details.no-pad.profile-suggestion-loaded > fieldset > div.location-group-wrapper > div.autocomplete-suggestions [data-location="${element.getAttribute('data-location')}"]`; 
      }
    });

    return desiredSelector ;
  });
  console.log("Boy",locationSelectorboy);
  if (locationSelectorboy) {
    await page.click(locationSelectorboy);
  }

  await page.select("#fin_byear","1993");
  await page.select("#fin_bmonth","2");
  await page.select("#fin_bday","5");
  await page.select("#fin_bhour","8");
  await page.select("#fin_bmin","47");
  await page.select("#fin_bapm","am");


  await page.waitForSelector("#astro-submit-button"); 
  await page.click("#astro-submit-button");


  //getting the match making data

  await page.waitForNavigation();
  const matchMakingResults=await page.evaluate(async () => {

    const finalVerdict=document.querySelector("#wrapper > main > div > div.tc.rounded.alert.no-margin.alert-danger > h2 > strong");

    const fans = {};
    const boyDetails={};
    const girlDetails={};

    const rows = document.querySelectorAll("#wrapper > main > div > div:nth-child(3) > table > tbody > tr")
    const array =Array.from(rows, row => {
      const columns = row.querySelectorAll('td');
      const arr= Array.from(columns, column => column.innerText);
      boyDetails[String(arr[0])]=arr[1];
      girlDetails[String(arr[0])]=arr[2];
      return arr;
    });
    console.log(boyDetails);
    console.log(girlDetails);

    // const boyRasiImage=document.querySelector("#wrapper > main > div > div:nth-child(11) > div > div:nth-child(1) > div.no-margin.tc > enx-image > picture > img")
    // const boyImageSrc=boyRasiImage.getAttribute('src');
    // console.log(boyImageSrc)

    const kundaliPoints=document.querySelector("#wrapper > main > div > div.no-pad.item-block.table-responsive.no-margin > table > thead > tr:nth-child(1) > th")
    
    
    // const tablePointsrows=document.querySelectorAll("#wrapper > main > div > div.no-pad.item-block.table-responsive.no-margin > table > tbody > tr");
    // Array.from(tablePointsrows, row => {
    //   let columnName=row.querySelector('th');
    //   if(columnName){
    //     columnName=columnName.innerText;
    //   }
    //   const columns = row.querySelectorAll('td');
    //   const arr= Array.from(columns, column => column.innerText);
    //   console.log(arr);
    //   console.log(columnName)
    // });
    
    const mangalDosh=document.querySelector("#wrapper > main > div > div:nth-child(17) > p.alert.alert-success.b.t-base.tc");

    fans.matchmakingverdict = finalVerdict ? finalVerdict.innerText : "";
    fans.boydetails=boyDetails;
    fans.girldetails=girlDetails;
    fans.kundalipoints=kundaliPoints ? kundaliPoints.innerText : "";
    // console.log(fans.matchmakingVerdict);
    fans.mangaldoshreport=mangalDosh? mangalDosh.innerText : "";


    return fans;

  });
  const gunChart=await page.waitForSelector("#wrapper > main > div > div.no-pad.item-block.table-responsive.no-margin");
  await gunChart.screenshot({
    path: 'images/gunComparison.png',
  });
  const boyRasiChart=await page.waitForSelector("#wrapper > main > div > div:nth-child(11) > div > div:nth-child(1) > div.no-margin.tc > enx-image > picture > img");
  await boyRasiChart.screenshot({
    path: 'images/boyRasiChart.png',
  });
  const girlRasiChart=await page.waitForSelector("#wrapper > main > div > div:nth-child(11) > div > div:nth-child(2) > div.no-margin.tc > enx-image > picture > img");
  await girlRasiChart.screenshot({
    path: 'images/girlRasiChart.png',
  });
  console.log(matchMakingResults)

  await browser.close();
});