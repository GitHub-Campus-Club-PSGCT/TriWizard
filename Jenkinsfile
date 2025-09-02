pipeline {
  agent any

  environment {
    REGISTRY = "ghcr.io"
    BACKEND_IMAGE = "ghcr.io/github-campus-club-psgct/triwizard-backend:latest"
    FRONTEND_IMAGE = "ghcr.io/github-campus-club-psgct/triwizard-frontend-participants:latest"
    BACKEND_CONTAINER = "triwizard-backend"
    FRONTEND_CONTAINER = "triwizard-frontend"
    DOCKER_CREDS = credentials('github-ghccwebsite') // GHCR creds
 }

  stages {
    stage('Login to GHCR') {
      steps {
        sh '''
          echo "$DOCKER_CREDS_PSW" | docker login $REGISTRY -u $DOCKER_CREDS_USR --password-stdin
        '''
      }
    }

stage('Run Backend Container') {
  steps {
    sh """
      if [ \$(docker ps -q -f name=${BACKEND_CONTAINER}) ]; then
        docker stop ${BACKEND_CONTAINER}
        docker rm ${BACKEND_CONTAINER}
      fi

      docker pull $BACKEND_IMAGE

      docker run -d --name ${BACKEND_CONTAINER} \
        -e MONGO_URI=your_mongo_uri \
        -e EMAIL_USER=your_email_user \
        -e EMAIL_PASS=your_email_pass \
        -e JWT_SECRET=your_jwt_secret \
        -e COMPILER_URL=your_compiler_url \
        -p 3001:5000 $BACKEND_IMAGE
    """
  }
}
    stage('Run Frontend Container') {
      steps {
        sh """
          if [ \$(docker ps -q -f name=${FRONTEND_CONTAINER}) ]; then
            docker stop ${FRONTEND_CONTAINER}
            docker rm ${FRONTEND_CONTAINER}
          fi

          docker pull $FRONTEND_IMAGE

          docker run -d --name ${FRONTEND_CONTAINER} -p 4173:4000 $FRONTEND_IMAGE
        """
      }
    }
  }
}