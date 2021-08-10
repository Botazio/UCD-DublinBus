// This folder contains functions that could be used in different part of the code

// Funtion used in the settings page to perform actions related with the user account 
// such as add favorite stops, markers, etc
export async function actionPost(url, body, setError, setIsPending, setOkMessage, isAuthenticated) {
   setIsPending(true);
   setError(false);
   setOkMessage(false);

   const response = await fetch(url, {
      method: "POST",
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
      isAuthenticated();
      setIsPending(false);
      setOkMessage(true);
   }

   return response;
}

// Funtion used in the settings page to perform actions related with the user account 
// such as add favorite stops, markers, etc
export async function actionDelete(url, setError, setIsPending, setOkMessage, isAuthenticated) {
   setIsPending(true);
   setError(false);
   setOkMessage(false);

   const response = await fetch(url, {
      method: "DELETE",
      headers: {
         Authorization: `JWT ${localStorage.getItem("token")}`,
         "Content-Type": "application/json"
      }
   });

   if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      setIsPending(false);
      setError(message);
   }

   if (response.ok) {
      isAuthenticated();
      setIsPending(false);
      setOkMessage(true);
   }

   return response;
}