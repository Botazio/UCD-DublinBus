// This folder contains functions that could be used in different part of the code


// Function that handles the logic to ensure the email is valid 
export function validateEmail(email) {
   var re = /\S+@\S+\.\S+/;
   return re.test(email);
}

// Funtion used in the settings page to perform actions related with the user account 
// such as add favorite stops, markers, etc
export async function actionFetch(url, type, body, setError, setIsPending, setOkMessage) {
   setIsPending(true);
   setError(false);
   setOkMessage(false);

   const response = await fetch(url, {
      method: type,
      headers: {
         Authorization: `JWT ${localStorage.getItem("token")}`,
         "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
   });

   if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      setIsPending(false);
      setError(message);
   }

   if (response.ok) {
      setIsPending(false);
      setOkMessage(true);
   }

   return response;
}

// Funtion used in the settings page to add a photo
// such as add favorite stops, markers, etc
export async function actionFetchMedia(url, type, body, setError, setIsPending, setOkMessage) {
   setIsPending(true);
   setError(false);
   setOkMessage(false);

   const response = await fetch(url, {
      method: type,
      headers: {
         Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      body: body
   });

   if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      setIsPending(false);
      setError(message);
   }

   if (response.ok) {
      setIsPending(false);
      setOkMessage(true);
   }

   return response;
}

