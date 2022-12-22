rm -rf _build
gulp buildSite --env=production --type=site
echo "--> Generando ZIP"
cd _build_site/
zip  -qq ../_deploy_server/siteJS.zip -r .
cd ..
echo "--> Copiando ZIP al servidor"
scp -P 2298 _deploy_server/siteJS.zip incloux@45.55.102.85:/var/www/siteJS.zip
echo "--> Generando Deploy"
ssh incloux@45.55.102.85 -p 2298 "rm -rf /var/www/jobssports/*;unzip -qq /var/www/siteJS.zip -d /var/www/jobssports/;rm /var/www/siteJS.zip"
#head -n 4 _build/assets/js/version.js
