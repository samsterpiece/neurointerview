# Neurointerview

<div align="center">
  <img src="frontend/public/assets/logo.png" alt="Neurointerview Logo" width="200">

  <p>
    <strong>Technical interviews reimagined for neurodivergent engineers</strong>
  </p>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#local-development">Local Development</a> •
    <a href="#project-structure">Project Structure</a> •
    <a href="#usage">Usage</a> •
    <a href="#customization">Customization</a> •
    <a href="#contributing">Contributing</a> •
    <a href="#license">License</a>
  </p>
</div>

## Overview

**Neurointerview** provides a technical interview platform specifically designed for neurodivergent engineers. The platform adapts to different neurodivergent profiles (ADHD, autism, social anxiety, dyslexia, etc.) to ensure candidates can showcase their actual coding abilities without common interview barriers.

By offering customizable accommodations and focusing on real-world problem-solving skills rather than algorithmic puzzles, Neurointerview helps companies discover exceptional talent that might be filtered out by traditional technical interviews.

## Features

### For Candidates
- 🧠 **Profile-Based Accommodations**: Interview experience customized to specific neurodivergent needs
- ⏱️ **Flexible Format**: Segmented sessions, extended time, and scheduled breaks
- 🎨 **Customizable Environment**: Adjustable fonts, colors, and visual density
- 💻 **Real-World Problems**: Practical engineering tasks instead of whiteboard puzzles
- 📝 **Multiple Communication Modes**: Text-based or verbal based on preference

### For Companies
- 🌐 **Diverse Talent Pool**: Access qualified candidates who excel in actual job skills
- 📊 **Better Assessment**: Evaluate engineers based on coding ability, not interview performance
- 📋 **Customizable Challenges**: Create relevant technical assessments
- 📈 **Comprehensive Analytics**: Track candidate performance with detailed metrics
- 🏢 **Corporate Dashboard**: Manage all assessments in one place

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/neurointerview.git
cd neurointerview
```

2. **Set up environment variables**

Create a `.env` file in the root directory:

```bash
# .env
MONGO_USER=root
MONGO_PASSWORD=rootpassword
MONGO_DB=neurointerview
SECRET_KEY=your-secret-key-change-this-in-production
```

3. **Start the application using Docker Compose**

```bash
docker-compose up
```

This will:
- Start MongoDB database
- Build and run the Django backend
- Build and run the React frontend
- Seed demo data for development

4. **Access the application**

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000/api](http://localhost:8000/api)
- MongoDB Express (database UI): [http://localhost:8081](http://localhost:8081)

5. **Default login credentials**

- Admin: admin@neurointerview.com / adminpassword
- Company: tech_admin@techinnovate.example.com / password123
- Candidate: alex@example.com / password123

## Local Development

### Backend Development

The Django backend code is mounted as a volume in Docker, so changes will be reflected immediately with the auto-reload feature.

```bash
# Run only the backend and database
docker-compose up backend mongo
```

You can run Django management commands through Docker:

```bash
# Create a superuser
docker-compose exec backend python manage.py createsuperuser

# Run migrations
docker-compose exec backend python manage.py migrate

# Seed demo data
docker-compose exec backend python manage.py seed_demo_data
```

### Frontend Development

The React frontend code is also mounted as a volume with hot-reloading enabled.

```bash
# Run only the frontend
docker-compose up frontend
```

For faster development, you can also run the frontend directly on your local machine:

```bash
cd frontend
npm install
npm start
```

### Database

MongoDB data is persisted in Docker volumes. To reset the database:

```bash
# Remove the volumes
docker-compose down -v

# Start again
docker-compose up
```

## Project Structure

```
neurointerview/
├── backend/                         # Django backend
│   ├── neurointerview/              # Django project
│   ├── api/                         # Django app for API
│   ├── assessments/                 # Assessment models and views
│   ├── users/                       # User authentication and profiles
│   ├── companies/                   # Company models and views
│   └── requirements.txt             # Python dependencies
│
├── frontend/                        # React frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── context/                 # Context providers
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── pages/                   # Page components
│   │   ├── services/                # API service layer
│   │   └── styles/                  # CSS/SCSS styles
│   └── package.json                 # NPM dependencies
│
└── docker-compose.yml               # Docker configuration
```

## Usage

### Candidate Journey

1. **Create Account**: Register as a candidate and set your neurodivergent profile preferences
2. **Dashboard**: View your pending and completed assessments
3. **Take Assessment**: Experience a customized interview interface with your preferred accommodations
4. **Review Results**: Track your performance and submission history

### Company Journey

1. **Create Account**: Register your company and invite team members
2. **Create Assessment**: Design custom technical evaluations for your open positions
3. **Invite Candidates**: Send assessment invitations to potential hires
4. **Review Submissions**: Evaluate candidate solutions with detailed insights
5. **Compare Performance**: Identify top talent based on actual coding ability

## Customization

### Neurodivergent Profiles

Neurointerview supports various accommodations for different neurodivergent profiles:

- **ADHD**: Segmented sessions, visual timers, distraction-reduced UI
- **Autism**: Clear instructions, predictable structure, literal language
- **Social Anxiety**: Text-based communication, reduced social pressure
- **Dyslexia**: Custom fonts, color overlays, text-to-speech support

### Assessment Types

Companies can create various types of technical assessments:

- **Coding Challenges**: Practical implementation tasks with test cases
- **System Design**: Architecture and design questions
- **Debugging**: Find and fix issues in existing code
- **Refactoring**: Improve code quality and maintainability

## Contributing

We welcome contributions to Neurointerview! Please check out our [contribution guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ for neurodivergent engineers everywhere</p>
</div>