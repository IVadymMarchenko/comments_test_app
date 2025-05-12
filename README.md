    🔧 Main Functions
    ✅ User registration and authorisation
    📝 Adding comments to publications
    💬 Nested replies to comments (cascading)
    🔄 AJAX support (without page reloading):
        Adding, replying to comments, handling errors on the client and server side
    📄 Pagination of comments, loading replies to comments by 8 items
    
    ⚙️ Technologies
    Language: Python 3.11
    Framework: Django
    Templates: Django templates
    Database: PostgreSQL
    Caching: Redis, cache invalidation when saving a new comment via Django signals
    Containerisation: Docker, Docker Compose
    Frontend: HTML, CSS, JavaScript (including AJAX), visual effects when clicking on images in comments.

    📁 Application structure
    app_base/ - project settings
    app_main/ - basic templates and home page, displaying basic comments on the home page, sorting comments
    app_users/ - user registration and authorisation
    app_comments/ - commenting logic, adding a new comment, adding a reply without reloading the page (models, forms, views, templates).
    static/app_main/ - JavaScript-files for working with AJAX,css styles
    templates/ - HTML templates
    Dockerfile and docker-compose.yml - to run in containers
    
    🚀 How to start a project
    git clone https://github.com/IVadymMarchenko/comments_test_app.git
    cd comments_test_app
    cd app_base
    docker-compose build
    docker-compose up -d
    http://localhost:8000


    
