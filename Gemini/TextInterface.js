const axios = require("axios");
require('dotenv').config();

const GOOGLE_API_KEY=process.env.GOOGLE_API_KEY


function removeCommasFromNumbers(inputString) {
    return inputString.replace(/\d{1,3}(,\d{3})+(\.\d+)?/g, function (match) {
      return match.replace(/,/g, "");
    });
  }

function parsePersonResults(inputString) {
    inputString = removeCommasFromNumbers(inputString);
  
    const regexFormats = [
      /([^:\n]+):\s*([^\n]+)/g,
      /\[([^[\]]+)\]:\s*([^[\]]+)/g,
      /\[([^[\]]+)\]\s*([^[\]]+)/g,
      /\[([^[\]]+)\],([^[\]]+)(?=(?:,\[|$))/g,
      /([^;]+):\s*([^;]+)(?:;|$)/g,
      /([^:,]+):\s*([^,]+),/g,
      /\[([^[\]]+):\s*([^[\]]+?)\]\s*/g,
      /- ([^:]+):\s*(.+)/g,
      /(?:\n|^)([^:\n]+):\s*([^\n]+)(?:\n|$)/g,
    ];
  
    let bestMatch = {};
    let maxFilledProperties = 0;
  
    for (const regex of regexFormats) {
      const obj = {};
      let filledProperties = 0;
  
      let match;
      while ((match = regex.exec(inputString)) !== null) {
        const key = match[1].trim();
        const value = match[2].trim();
  
        const normalizedKey = key.toLowerCase().replace(/\s+/g, "_");
  
        switch (normalizedKey) {
          case "name":
            obj.name = value;
            filledProperties++;
            break;
          case "fathername":
            obj.fatherName = value;
            filledProperties++;
            break;
          case "dateofbirth":
            obj.dateOfBirth = value;
            filledProperties++;
            break;
          case "residentialaddress":
            obj.residentialAddress = value;
            filledProperties++;
            break;
          case "timeofbirth":
            obj.timeOfBirth = value;
            filledProperties++;
            break;
          case "salary":
            obj.salary = value;
            filledProperties++;
            break;
          case "race/caste/gotra":
            obj.race = value;
            filledProperties++;
            break;
          case "workingcompany":
            obj.working_company = value;
            filledProperties++;
            break;
          case "ismanglik":
            obj.isManglik = value;
            filledProperties++;
            break;
          case "occupation":
            obj.occupation = value;
            filledProperties++;
            break;
          case "contactnumber(s)":
            obj.contactNumber = value;
            filledProperties++;
            break;
          case "height":
            obj.height = value;
            filledProperties++;
            break;
        }
      }
  
      if (filledProperties > maxFilledProperties) {
        bestMatch = obj;
        maxFilledProperties = filledProperties;
      }
    }
    return bestMatch;
  }


function removeOccurrences(inputString, substringToRemove) {
    const escapedSubstring = substringToRemove.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
    const regex = new RegExp(escapedSubstring, "g");
    const result = inputString.replace(regex, "");
    return result;
}

const GetPersonDetails = async (BioData) => {
  try {
      const response = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GOOGLE_API_KEY,
          {
              contents: [
                  {
                      role: 'user',
                      parts: [{ text: `You will be given a bio-data of boy for wedding proposal from a matrimonial organization. 
                      You need to fetch details from the text and give strictly in the format given below.
                      If any field is not recognizable from text just put null in front of it.
                      
                      Name: 
                      FatherName: 
                      DateofBirth: 
                      ResidentialAddress: 
                      TimeofBirth: 
                      Salary: 
                      Race/Caste/Gotra: 
                      WorkingCompany: 
                      isManglik: 
                      Occupation: 
                      Contactnumber(s): 
                      Height: ` }]
                  },
                  {
                      role: 'user',
                      parts: [
                          {
                              text:BioData
                          }
                      ]
                  },
              ]
          },
          {
              headers: {
                  'Content-Type': 'application/json'
              }
          }
      );
      const { data } = response;
      const finalOutputAfterRefactoring = removeOccurrences(
        data.candidates[0].content.parts[0].text,
        "**"
      );
      console.log(finalOutputAfterRefactoring);
      return finalOutputAfterRefactoring;
  } catch (error) {
      console.error('Error:', error.message);
  }
};
const fetchDetails=async ()=>{
    const details=await GetPersonDetails(`Name: Krishan Vaid
    D.O.B: 14th May 1994
    Time: 08:15 AM
    Place: New Delhi
    Manglik: No
    Diet: Veg ( Occasionally Non Veg )
    Drinking: No
    Smoking: No
    Height: 5'8"
    Weight: 72-73 Kgs
    Qualification: CA
    Occupation: Service
    Profile: Assistant Manager in Deloitte (India)
    Deptt: Risk Advisory
    Work Location: Gurgaon
    Package: 11 Lacs
    Residence: Self-owned House in Subhash Nagar

    Family Details
    Father: Late Sudarshan Vaid
    Occupation: Retired from the Post of Assistant Traffic Inspector (ATI) from Delhi Transport Corporation
    Mother: Renu Vaid
    Occupation: Home-maker
    Elder Sister: Married
    Son-In-Law: Manager in MNC
    Younger Brother: Unmarried
    Education & Occupation: CA working in PWC`);


    const detailsObj=parsePersonResults(details);
    console.log(detailsObj);
}
fetchDetails();
