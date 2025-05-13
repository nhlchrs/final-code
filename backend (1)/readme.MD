1. Clone the Repository
git clone <repository_url>
cd <project_directory>
2. Install Dependencies
Run the following command to install the project dependencies:
npm install
3. Create .env File
In the root of the project, create a .env file and add the following lines:
JWT_SECRET_KEY=YOUR_SECRET_KEY
MONGO_BASE_URL=MONGODB_URL
PORT=5000
Replace YOUR_SECRET_KEY with a strong secret key for JWT, and MONGODB_URL with the connection URL for your MongoDB instance.

4. Start the Server
Once the dependencies are installed and the .env file is configured, run the following command to start the server:
npm run dev
Your Node.js app will now be running on the specified port (default is 5000).