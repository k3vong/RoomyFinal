# Roomy - Production Deployment Guide

## Pre-Deployment Checklist

### Code Quality
- [x] All ESLint warnings resolved
- [x] No console errors in production
- [x] All TypeScript/JSX errors fixed
- [x] Code formatted consistently
- [x] Unused imports removed

### Testing
- [x] All functional tests passing
- [x] Responsive design tested on multiple devices
- [x] Cross-browser compatibility verified
- [x] Accessibility standards met (WCAG 2.1 AA)
- [x] Performance metrics acceptable

### Security
- [x] Environment variables configured
- [x] API endpoints secured
- [x] CORS properly configured
- [x] Authentication flow tested
- [x] No sensitive data in source code

### Performance
- [x] Code splitting implemented
- [x] Lazy loading configured
- [x] Bundle size optimized
- [x] Images optimized
- [x] Caching strategy defined

### Documentation
- [x] README.md complete
- [x] DESIGN-SYSTEM.md created
- [x] TESTING-CHECKLIST.md created
- [x] API documentation available
- [x] Setup instructions clear

## Build Process

### Frontend Build

1. **Install Dependencies**
   ```bash
   cd RoomyFinal-main/RoomyFinal-main
   npm install
   ```

2. **Run Production Build**
   ```bash
   npm run build
   ```

3. **Build Output**
   - Location: `dist/` directory
   - Contents: Optimized HTML, CSS, JS bundles
   - Assets: Images, fonts, other static files

4. **Preview Production Build Locally**
   ```bash
   npm run preview
   ```

### Backend Build

1. **Build with Maven**
   ```bash
   cd RoomyFinal-Backend/RoomyFinal-Backend
   ./mvnw clean package
   ```

2. **Build Output**
   - Location: `target/roomy-backend-1.0.0.jar`
   - Type: Executable Spring Boot JAR

3. **Run Backend**
   ```bash
   java -jar target/roomy-backend-1.0.0.jar
   ```

## Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Frontend Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Backend Docker (Already Configured)
```bash
cd RoomyFinal-Backend/RoomyFinal-Backend
docker-compose up --build -d
```

### Option 2: Cloud Platform Deployment

#### Vercel (Frontend)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts

#### Heroku (Backend)
1. Create Heroku app: `heroku create roomy-backend`
2. Add PostgreSQL: `heroku addons:create heroku-postgresql:hobby-dev`
3. Deploy: `git push heroku main`

#### AWS (Full Stack)
- **Frontend**: Deploy to S3 + CloudFront
- **Backend**: Deploy to Elastic Beanstalk or ECS
- **Database**: Use RDS for PostgreSQL

#### Azure (Full Stack)
- **Frontend**: Deploy to Azure Static Web Apps
- **Backend**: Deploy to Azure App Service
- **Database**: Use Azure Database for PostgreSQL

### Option 3: Traditional VPS Deployment

#### Frontend (Nginx)
1. Build frontend
2. Copy `dist/` to `/var/www/roomy`
3. Configure Nginx:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/roomy;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

#### Backend (Systemd Service)
1. Copy JAR to server
2. Create systemd service:
   ```ini
   [Unit]
   Description=Roomy Backend
   
   [Service]
   User=roomy
   ExecStart=/usr/bin/java -jar /opt/roomy/roomy-backend.jar
   SuccessExitStatus=143
   
   [Install]
   WantedBy=multi-user.target
   ```

## Environment Configuration

### Frontend Environment Variables
Create `.env.production`:
```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Roomy
```

### Backend Environment Variables
Set in `application.properties` or environment:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/roomy
spring.datasource.username=roomy_user
spring.datasource.password=secure_password
server.port=8080
```

## Performance Monitoring

### Recommended Tools
- **Frontend**: Google Lighthouse, Web Vitals
- **Backend**: Spring Boot Actuator, Prometheus
- **Database**: PostgreSQL pg_stat_statements
- **APM**: New Relic, DataDog, or Sentry

### Key Metrics to Monitor
- **Response Time**: < 200ms average
- **Error Rate**: < 1%
- **Uptime**: > 99.9%
- **Database Connections**: Monitor pool usage
- **Memory Usage**: Track heap usage

## Security Best Practices

### Frontend
- [ ] Enable HTTPS
- [ ] Set security headers (CSP, HSTS, X-Frame-Options)
- [ ] Implement rate limiting
- [ ] Use secure cookies
- [ ] Sanitize user input

### Backend
- [ ] Enable HTTPS
- [ ] Implement authentication (JWT/OAuth)
- [ ] Set CORS whitelist
- [ ] Use prepared statements (SQL injection prevention)
- [ ] Implement rate limiting
- [ ] Regular dependency updates

### Database
- [ ] Use strong passwords
- [ ] Enable SSL connections
- [ ] Regular backups
- [ ] Restrict network access
- [ ] Monitor for suspicious activity

## Scaling Considerations

### Horizontal Scaling
- Load balance frontend with Nginx/HAProxy
- Run multiple backend instances
- Use Redis for session management
- Implement caching strategy

### Vertical Scaling
- Increase server resources as needed
- Optimize database queries
- Add database indexes
- Use connection pooling

## CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Frontend
        run: |
          cd RoomyFinal-main/RoomyFinal-main
          npm ci
          npm run build
      - name: Deploy Frontend
        run: |
          # Deploy to hosting provider
```

## Post-Deployment

### Verification Checklist
- [ ] Application accessible at production URL
- [ ] All pages load correctly
- [ ] API endpoints responding
- [ ] Database connections working
- [ ] Authentication functional
- [ ] SSL certificate valid
- [ ] No console errors
- [ ] Performance metrics acceptable

### Monitoring Setup
- [ ] Set up uptime monitoring
- [ ] Configure error tracking
- [ ] Set up performance monitoring
- [ ] Configure alerts
- [ ] Set up log aggregation

## 🆘 Troubleshooting

### Common Issues

**Frontend not loading**
- Check nginx/server configuration
- Verify build completed successfully
- Check browser console for errors

**Backend not responding**
- Check if service is running
- Verify database connection
- Check application logs
- Verify port is open

**Database connection errors**
- Verify credentials
- Check network connectivity
- Verify PostgreSQL is running
- Check connection pool settings

## 📞 Support

For issues or questions:
- Check documentation: `README.md`, `DESIGN-SYSTEM.md`
- Review test cases: `TESTING-CHECKLIST.md`
- Check application logs
- Contact development team

## Success!

Your Roomy application is now deployed and ready to help roommates manage their shared living spaces!

**Next Steps:**
1. Monitor initial user feedback
2. Track performance metrics
3. Plan feature enhancements
4. Schedule regular maintenance
5. Keep dependencies updated
