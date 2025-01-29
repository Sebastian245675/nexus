import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Configura Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB0gh9Hq5JXTEmeqvsJHLVQULdH1W7YffM",
  authDomain: "nexus-5c53d.firebaseapp.com",
  projectId: "nexus-5c53d",
  storageBucket: "nexus-5c53d.appspot.com",
  messagingSenderId: "208164583979",
  appId: "1:208164583979:web:8fd62a5c315fe50ad7486e",
  measurementId: "G-WENGRWS7N9"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth=getAuth(app);
// Function to check if user information exists
async function checkUserInfo(userId) {
    const userRef = doc(db, "Informacion", userId); // Reference specific document based on user ID
    const userSnap = await getDoc(userRef);
  
    return userSnap.exists(); // Return true if document exists, false otherwise
  }
  
  // Function to handle user information form submission
  async function handleUserInfoSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior
  
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const age = document.getElementById("age").value;
    const profession = document.getElementById("profession").value;
    const country = document.getElementById("country").value;
    const city = document.getElementById("city").value;
  
    const userInfo = {
      firstName,
      lastName,
      age,
      profession,
      country,
      city,
    };
  
    // Add user information to Firestore
    await addDoc(collection(db, "Informacion"), userInfo);
  
    // Close the modal or hide the form (implementation depends on your UI)
    console.log("User information saved successfully!"); // Optional success message
  
    // Optionally, reload the main page or update the UI to reflect the saved information
  }
  
  // Event listener for user authentication state changes
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userId = user.uid;
  
      // Check if user information exists
      const userInfoExists = await checkUserInfo(userId);
  
      if (!userInfoExists) {
        // User information not found, display the form
        // (Implementation depends on your UI framework, e.g., modal, hidden element)
        console.log("User information not found, displaying form...");
        showModal(); // Replace with your function to show the modal
  
        // Bind form submission handler
        const userInfoForm = document.getElementById("userInfoForm"); // Replace with your form ID
        userInfoForm.addEventListener("submit", handleUserInfoSubmit);
      } else {
        console.log("User information already exists.");
        // Optionally, proceed with other actions assuming user information is available
      }
    } else {
      console.log("User not authenticated");
    }
  });