# SchedULAr Website

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
<br/>
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)

## About Project
This project is a scheduling tool designed to streamline the process of assigning Undergraduate Learning Assistants (ULAs) to CS lab sessions. Instead of manually copying lab schedules into a spreadsheet each quarter, the website pulls course data directly from the Banner API and displays it in a calendar. ULAs can input their availability, and the supervisor can assign shifts with an easy-to-use interface. This tool simplifies scheduling, reduces manual work, and makes the process more maintainable for future quarters.

## Node.js

SchedULAr Website runs on Node.js Version 16.17.0 and higher. Please ensure you have Node.js installed via the [official website](https://nodejs.org/en).

## Next.js

This project is built using [Next.js](https://nextjs.org), a React framework. Next.js is automatically installed when you install all dependencies for this project.

## Environment Variables

The following environment variables are required and must be stored in an `.env` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID="
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## Commands

### Dependencies

```bash
# Install dependencies
npm i

# Add dependency
npm i <dependency>

# Remove dependency
npm un <dependency>
```

### Running the Website Locally

```bash
# Open a browser at localhost:3000
npm run dev
```

### Formatting Code via Prettier

```bash
# Rewrite code recursively with proper formatting
npm run format

# Show formatting differences recursively
npm run check
```

### Linting Code via Eslint

```bash
npm run eslint
```

### Build the Website

```bash
npm run build
```

## Main Functionalities
### 1. Lab sections for each course are automactially pulled from the Banner API
### 2. ULA select list their availbility for each lab section
- Double check mark (available)
- Single check mark (available if needed)
- Cross mark (not available)
- Input number of office hours planning to host per week
- Hit the submit button

![image](https://github.com/user-attachments/assets/0543ed94-02bf-4dc1-b98f-dc0d0389c98c)
### 3. Click on a lab section to show pop-up modal
- Displays the course, course section number, and location of the lab
- Displays availability for all ULA
- Click on a ULA's name to assign them to the lab section (admin only)

![image](https://github.com/user-attachments/assets/686ce6d6-1607-49ca-9274-fe970ce50793)
