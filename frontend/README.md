1. Clone the Repository
git clone <repository_url>
cd <project_directory>
2. Install Dependencies
Run the following command to install the project dependencies:
npm install
3. Create .env File
In the root of the project, create a .env file and add the following line:
REACT_APP_BASE_URL=http://localhost:5000
This will set the REACT_APP_BASE_URL environment variable that can be accessed in your React app.

4. Start the Development Server
Once the dependencies are installed and the .env file is configured, run the following command to start the development server:


npm start
Your React app will now be running on http://localhost:3000.