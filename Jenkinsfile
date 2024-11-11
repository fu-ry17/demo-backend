@Library('node-backend-lib') _

pipeline {
    agent any
    stages {
        stage("Generate Pipelines") {
            steps {
                script {
                    multiPipelines()
                }
            }
        }
    }
} 