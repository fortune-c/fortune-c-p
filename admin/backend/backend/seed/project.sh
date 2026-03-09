#!/bin/bash
# USAGE: TOKEN="your_token" bash project.sh
if [ -z "$TOKEN" ]; then
    echo "Error: TOKEN environment variable is not set."
    exit 1
fi
URL="https://fortune-c-p-api.onrender.com/api/projects"

projects=(
'{
    "title": "CivicVotes",
    "subtitle": "Election & Voting Management System",
    "description": "CivicVotes is a production-ready Election & Voting Management System built with ASP.NET Core Web API.",
    "github": "https://github.com/fortune-c/civicvote",
    "live": "#",
    "imageUrl": "/assets/projects-preview/CivicVotes.png",
    "tags": ["ASP.NET Core", "C#", "MongoDB"],
    "featured": true,
    "order": 1
}'
'{
    "title": "PORTFOLIO",
    "subtitle": "Personal Website",
    "description": "A modern developer portfolio website built to showcase my projects, skills, and experience.",
    "github": "https://github.com/fortune-c/fortune-c-p",
    "live": "#",
    "imageUrl": "/assets/projects-preview/portfolio.png",
    "tags": ["TypeScript", "TailwindCSS", "NoSQL"],
    "featured": true,
    "order": 2
}'
'{
    "title": "Netus",
    "subtitle": "C Networking Project",
    "description": "Netus is a minimal HTTP server written from scratch in C, implementing core components directly on top of POSIX sockets.",
    "github": "https://github.com/fortune-c/netus",
    "live": "#",
    "imageUrl": "/assets/projects-preview/Netus.png",
    "tags": ["C", "Networking", "POSIX"],
    "featured": true,
    "order": 3
}'
)

for p in "${projects[@]}"; do
    curl -X POST "$URL" \
         -H "Content-Type: application/json" \
         -H "Authorization: Bearer $TOKEN" \
         -d "$p"
    echo -e "\n---"
done

# seed command: bash /admin/backend/seed_projects.sh