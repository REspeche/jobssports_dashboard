rm -rf _build
gulp buildDashboard --env=production --type=dashboard
echo "--> Generando ZIP"
cd _build_dashboard/
zip  -qq ../_deploy_server/dashboardJS.zip -r .
cd ..
echo "--> Copiando ZIP al servidor"
scp -P 2298 _deploy_server/dashboardJS.zip incloux@45.55.102.85:/var/www/dashboardJS.zip
echo "--> Generando Deploy"
ssh incloux@45.55.102.85 -p 2298 "rm -rf /var/www/dashboard.jobssports/*;unzip -qq /var/www/dashboardJS.zip -d /var/www/dashboard.jobssports/;rm /var/www/dashboardJS.zip"
#head -n 4 _build/assets/js/version.js
