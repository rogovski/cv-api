# About

turn your resume into a REST api

# Usage

install serverless

```
# might need to run sudo
npm install -g serverless
```

cd into the repo

```
cd cv-api
```

generate a config.yml containing your resumes identifier

```
echo "cvname: johnsmith" >> config.yml
```

create a bucket for deployment artifacts

```
aws s3 mb s3://com.johnsmith.serverless.us-east-1.deploys
```

deploy the application. collect the output (contains the api key and created endpoints)

```
serverless deploy | tee deployment.log
```

write your resume content. create the following:

* about.md
* contact.md
* education.md
* references.md

there is also an empty directory for employers.

* employers
  * foo.md
  * bar.md

once completed, sync your resume content with the s3 bucket created by the deployment

```
aws s3 sync ./cv s3://com.johnsmith.cv --exclude "*.gitkeep"
```
