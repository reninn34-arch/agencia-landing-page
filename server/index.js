const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize database
const initDatabase = async () => {
  try {
    const client = await pool.connect();
    
    // Create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        site_name VARCHAR(255),
        logo TEXT,
        admin_password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS socials (
        id SERIAL PRIMARY KEY,
        site_id INT DEFAULT 1,
        facebook VARCHAR(500),
        instagram VARCHAR(500),
        twitter VARCHAR(500),
        linkedin VARCHAR(500),
        tiktok VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS hero_section (
        id SERIAL PRIMARY KEY,
        site_id INT DEFAULT 1,
        title_part1 VARCHAR(255),
        title_accent VARCHAR(255),
        subtitle TEXT,
        button_primary VARCHAR(255),
        button_secondary VARCHAR(255),
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        site_id INT DEFAULT 1,
        section_title VARCHAR(255),
        section_subtitle VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS service_items (
        id SERIAL PRIMARY KEY,
        service_id INT REFERENCES services(id) ON DELETE CASCADE,
        title VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        site_id INT DEFAULT 1,
        title VARCHAR(255),
        category VARCHAR(100),
        media_type VARCHAR(50),
        image TEXT,
        description TEXT,
        tech VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS pricing_plans (
        id SERIAL PRIMARY KEY,
        site_id INT DEFAULT 1,
        plan_name VARCHAR(255),
        price VARCHAR(50),
        period VARCHAR(50),
        button_text VARCHAR(255),
        is_popular BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS plan_features (
        id SERIAL PRIMARY KEY,
        plan_id INT REFERENCES pricing_plans(id) ON DELETE CASCADE,
        feature TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS about_section (
        id SERIAL PRIMARY KEY,
        site_id INT DEFAULT 1,
        section_title VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS about_items (
        id SERIAL PRIMARY KEY,
        about_id INT REFERENCES about_section(id) ON DELETE CASCADE,
        title VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS cta_section (
        id SERIAL PRIMARY KEY,
        site_id INT DEFAULT 1,
        title VARCHAR(255),
        text TEXT,
        button_text VARCHAR(255),
        whatsapp_number VARCHAR(20),
        background_image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Initialize default data if empty
    const settingsResult = await client.query('SELECT COUNT(*) FROM site_settings');
    if (parseInt(settingsResult.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO site_settings (site_name, logo, admin_password)
        VALUES ($1, $2, $3)
      `, ['Digital Agency', '', 'admin123']);

      await client.query(`
        INSERT INTO socials (facebook, instagram, twitter, linkedin, tiktok)
        VALUES ($1, $2, $3, $4, $5)
      `, ['https://facebook.com', 'https://instagram.com', '', 'https://linkedin.com', '']);

      await client.query(`
        INSERT INTO hero_section (title_part1, title_accent, subtitle, button_primary, button_secondary, image)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        'Impulsa tu',
        'Negocio Online',
        'Estrategias Digitales que Funcionan.',
        'Conoce Nuestros Servicios',
        'Ver Portafolio',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
      ]);

      const servicesResult = await client.query(`
        INSERT INTO services (section_title, section_subtitle)
        VALUES ($1, $2) RETURNING id
      `, ['Nuestros Servicios', 'Soluciones a tu medida']);

      const servicesId = servicesResult.rows[0].id;
      await client.query(`
        INSERT INTO service_items (service_id, title, description)
        VALUES 
          ($1, $2, $3),
          ($1, $4, $5),
          ($1, $6, $7),
          ($1, $8, $9)
      `, [
        servicesId,
        'Manejo de Redes Sociales', 'Gestión de contenido y estrategia para tus redes.',
        'Desarrollo Web', 'Creación de sitios web modernos y funcionales.',
        'SEO & Analítica', 'Optimización y análisis de resultados.',
        'Software Empresarial', 'Sistemas personalizados para automatizar procesos.'
      ]);

      const aboutResult = await client.query(`
        INSERT INTO about_section (section_title)
        VALUES ($1) RETURNING id
      `, ['¿Por Qué Elegirnos?']);

      const aboutId = aboutResult.rows[0].id;
      await client.query(`
        INSERT INTO about_items (about_id, title, description)
        VALUES
          ($1, $2, $3),
          ($1, $4, $5),
          ($1, $6, $7)
      `, [
        aboutId,
        'Experiencia Profesional', 'Años de experiencia entregando resultados.',
        'Estrategias Efectivas', 'Soluciones adaptadas a tu negocio.',
        'Atención Personalizada', 'Comprometidos con tu éxito.'
      ]);

      await client.query(`
        INSERT INTO cta_section (title, text, button_text, whatsapp_number, background_image)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        '¿Listos para crecer tu negocio?',
        '¡Hablemos hoy! Descubre cómo podemos llevar tu empresa al siguiente nivel.',
        'Contáctanos',
        '521234567890',
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80'
      ]);
    }

    // Seed default pricing plans if empty (even if settings already exist)
    const pricingResult = await client.query('SELECT COUNT(*) FROM pricing_plans');
    if (parseInt(pricingResult.rows[0].count) === 0) {
      const plan1Result = await client.query(`
        INSERT INTO pricing_plans (site_id, plan_name, price, period, button_text, is_popular)
        VALUES (1, $1, $2, $3, $4, $5) RETURNING id
      `, ['Básico', '$199', '/mes', 'Empezar ahora', false]);

      const plan1Id = plan1Result.rows[0].id;
      await client.query(`
        INSERT INTO plan_features (plan_id, feature)
        VALUES
          ($1, $2),
          ($1, $3),
          ($1, $4),
          ($1, $5)
      `, [plan1Id, 'Gestión de 1 Red Social', '4 Posts Mensuales', 'Soporte Vía Email', 'Reporte Mensual']);

      const plan2Result = await client.query(`
        INSERT INTO pricing_plans (site_id, plan_name, price, period, button_text, is_popular)
        VALUES (1, $1, $2, $3, $4, $5) RETURNING id
      `, ['Profesional', '$499', '/mes', 'Plan más elegido', true]);

      const plan2Id = plan2Result.rows[0].id;
      await client.query(`
        INSERT INTO plan_features (plan_id, feature)
        VALUES
          ($1, $2),
          ($1, $3),
          ($1, $4),
          ($1, $5),
          ($1, $6)
      `, [plan2Id, 'Gestión de 3 Redes', '12 Posts Mensuales', 'Atención Prioritaria', 'Análisis de Competencia', 'Diseño de Landing Page']);

      const plan3Result = await client.query(`
        INSERT INTO pricing_plans (site_id, plan_name, price, period, button_text, is_popular)
        VALUES (1, $1, $2, $3, $4, $5) RETURNING id
      `, ['Elite', '$999', '/mes', 'Contactar para detalles', false]);

      const plan3Id = plan3Result.rows[0].id;
      await client.query(`
        INSERT INTO plan_features (plan_id, feature)
        VALUES
          ($1, $2),
          ($1, $3),
          ($1, $4),
          ($1, $5),
          ($1, $6)
      `, [plan3Id, 'Redes Ilimitadas', 'Contenido Diario', 'Estrategia Ads Full', 'Software a Medida', 'Consultoría 1 a 1']);
    }
    
    client.release();
    console.log('Database initialized with all tables');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
};

// Default content
function getDefaultContent() {
  return {
    logo: "",
    siteName: "Digital Agency",
    adminPassword: "admin123",
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "",
      linkedin: "https://linkedin.com",
      tiktok: ""
    },
    hero: {
      titlePart1: "Impulsa tu",
      titleAccent: "Negocio Online",
      subtitle: "Estrategias Digitales que Funcionan.",
      buttonPrimary: "Conoce Nuestros Servicios",
      buttonSecondary: "Ver Portafolio",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
    },
    services: {
      sectionTitle: "Nuestros Servicios",
      sectionSubtitle: "Soluciones digitales integrales",
      items: []
    },
    plans: {
      sectionTitle: "Planes",
      sectionSubtitle: "Elige el plan perfecto",
      items: []
    },
    about: {
      sectionTitle: "¿Por Qué Nosotros?",
      items: []
    },
    cta: {
      title: "Transforma Tu Negocio Hoy",
      text: "Contáctanos para una consulta gratuita",
      buttonText: "Contáctanos",
      whatsappNumber: "+1234567890",
      backgroundImage: ""
    }
  };
}

// Routes

// Get all content
app.get('/api/content', async (req, res) => {
  try {
    const [settings, socials, hero, services, projects, pricing, about, cta] = await Promise.all([
      pool.query('SELECT * FROM site_settings LIMIT 1'),
      pool.query('SELECT * FROM socials LIMIT 1'),
      pool.query('SELECT * FROM hero_section LIMIT 1'),
      pool.query('SELECT * FROM services LIMIT 1'),
      pool.query('SELECT * FROM projects ORDER BY created_at DESC'),
      pool.query('SELECT * FROM pricing_plans'),
      pool.query('SELECT * FROM about_section LIMIT 1'),
      pool.query('SELECT * FROM cta_section LIMIT 1')
    ]);

    const settingsRow = settings.rows[0] || {};
    const socialsRow = socials.rows[0] || {};
    const heroRow = hero.rows[0] || {};
    const servicesRow = services.rows[0] || {};
    const aboutRow = about.rows[0] || {};
    const ctaRow = cta.rows[0] || {};

    // Get service items
    const serviceItems = await pool.query(
      'SELECT id, title, description FROM service_items WHERE service_id = $1',
      [servicesRow.id || 1]
    );

    // Get about items
    const aboutItems = await pool.query(
      'SELECT id, title, description FROM about_items WHERE about_id = $1',
      [aboutRow.id || 1]
    );

    // Get pricing with features
    const pricingWithFeatures = await Promise.all(
      pricing.rows.map(async (plan) => {
        const features = await pool.query(
          'SELECT feature FROM plan_features WHERE plan_id = $1',
          [plan.id]
        );
        return {
          id: plan.id,
          name: plan.plan_name || '',
          price: plan.price || '',
          period: plan.period || '',
          buttonText: plan.button_text || '',
          isPopular: plan.is_popular || false,
          features: features.rows.map(f => f.feature || '')
        };
      })
    );

    const content = {
      logo: settingsRow.logo || '',
      siteName: settingsRow.site_name || '',
      adminPassword: settingsRow.admin_password || '',
      socials: {
        facebook: socialsRow.facebook || '',
        instagram: socialsRow.instagram || '',
        twitter: socialsRow.twitter || '',
        linkedin: socialsRow.linkedin || '',
        tiktok: socialsRow.tiktok || ''
      },
      hero: {
        titlePart1: heroRow.title_part1 || '',
        titleAccent: heroRow.title_accent || '',
        subtitle: heroRow.subtitle || '',
        buttonPrimary: heroRow.button_primary || '',
        buttonSecondary: heroRow.button_secondary || '',
        image: heroRow.image || ''
      },
      services: {
        sectionTitle: servicesRow.section_title || '',
        sectionSubtitle: servicesRow.section_subtitle || '',
        items: serviceItems.rows.map(item => ({
          id: item.id,
          title: item.title || '',
          description: item.description || ''
        }))
      },
      plans: {
        sectionTitle: 'Planes de Inversión',
        sectionSubtitle: 'Escoge el nivel de crecimiento para tu marca',
        items: pricingWithFeatures
      },
      about: {
        sectionTitle: aboutRow.section_title || '',
        items: aboutItems.rows.map(item => ({
          id: item.id,
          title: item.title || '',
          description: item.description || ''
        }))
      },
      cta: {
        title: ctaRow.title || '',
        text: ctaRow.text || '',
        buttonText: ctaRow.button_text || '',
        whatsappNumber: ctaRow.whatsapp_number || '',
        backgroundImage: ctaRow.background_image || ''
      }
    };

    res.json(content);
  } catch (err) {
    console.error('Error fetching content:', err);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Get all projects (Portfolio)
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    const projects = result.rows.map(p => ({
      id: p.id,
      title: p.title || '',
      category: p.category || '',
      mediaType: p.media_type || 'image',
      image: p.image || '',
      description: p.description || '',
      tech: p.tech || ''
    }));
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Save content
app.post('/api/content', async (req, res) => {
  try {
    const { content, projects: projectsData, password } = req.body;
    
    // Verify password
    if (password !== process.env.ADMIN_PASSWORD && password !== 'admin123') {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    const client = await pool.connect();
    await client.query('BEGIN');

    try {
      // Update site settings
      await client.query(`
        UPDATE site_settings SET 
          logo = $1,
          site_name = $2,
          admin_password = $3,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `, [content.logo, content.siteName, content.adminPassword]);

      // Update socials
      await client.query(`
        UPDATE socials SET
          facebook = $1,
          instagram = $2,
          twitter = $3,
          linkedin = $4,
          tiktok = $5,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `, [
        content.socials.facebook,
        content.socials.instagram,
        content.socials.twitter,
        content.socials.linkedin,
        content.socials.tiktok
      ]);

      // Update hero section
      await client.query(`
        UPDATE hero_section SET
          title_part1 = $1,
          title_accent = $2,
          subtitle = $3,
          button_primary = $4,
          button_secondary = $5,
          image = $6,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `, [
        content.hero.titlePart1,
        content.hero.titleAccent,
        content.hero.subtitle,
        content.hero.buttonPrimary,
        content.hero.buttonSecondary,
        content.hero.image
      ]);

      // Update services section and items
      await client.query(`
        UPDATE services SET
          section_title = $1,
          section_subtitle = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `, [content.services.sectionTitle, content.services.sectionSubtitle]);

      await client.query('DELETE FROM service_items WHERE service_id = 1');
      for (const item of content.services.items) {
        await client.query(`
          INSERT INTO service_items (service_id, title, description)
          VALUES (1, $1, $2)
        `, [item.title, item.description]);
      }

      // Update about section and items
      await client.query(`
        UPDATE about_section SET
          section_title = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `, [content.about.sectionTitle]);

      await client.query('DELETE FROM about_items WHERE about_id = 1');
      for (const item of content.about.items) {
        await client.query(`
          INSERT INTO about_items (about_id, title, description)
          VALUES (1, $1, $2)
        `, [item.title, item.description]);
      }

      // Update CTA section
      await client.query(`
        UPDATE cta_section SET
          title = $1,
          text = $2,
          button_text = $3,
          whatsapp_number = $4,
          background_image = $5,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `, [
        content.cta.title,
        content.cta.text,
        content.cta.buttonText,
        content.cta.whatsappNumber,
        content.cta.backgroundImage
      ]);

      // Update pricing plans and features
      await client.query('DELETE FROM plan_features');
      await client.query('DELETE FROM pricing_plans WHERE site_id = 1');
      
      for (const plan of content.plans.items) {
        const planResult = await client.query(`
          INSERT INTO pricing_plans (site_id, plan_name, price, period, button_text, is_popular)
          VALUES (1, $1, $2, $3, $4, $5) RETURNING id
        `, [plan.name, plan.price, plan.period, plan.buttonText, plan.isPopular]);

        const planId = planResult.rows[0].id;
        for (const feature of plan.features) {
          await client.query(`
            INSERT INTO plan_features (plan_id, feature)
            VALUES ($1, $2)
          `, [planId, feature]);
        }
      }

      // Update projects (portfolio)
      if (projectsData && Array.isArray(projectsData)) {
        // Delete existing projects and replace with new ones
        await client.query('DELETE FROM projects WHERE site_id = 1');
        
        for (const project of projectsData) {
          await client.query(`
            INSERT INTO projects (site_id, title, category, media_type, image, description, tech)
            VALUES (1, $1, $2, $3, $4, $5, $6)
          `, [
            project.title,
            project.category,
            project.mediaType,
            project.image,
            project.description,
            project.tech
          ]);
        }
      }

      await client.query('COMMIT');
      res.json({ success: true, message: 'Content saved successfully' });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error saving content:', err);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Add/Update project
app.post('/api/projects', async (req, res) => {
  try {
    const { project, password } = req.body;
    
    if (password !== process.env.ADMIN_PASSWORD && password !== 'admin123') {
      return res.status(401).json({ error: 'Invalid password' });
    }

    if (project.id) {
      // Update existing project
      await pool.query(`
        UPDATE projects SET
          title = $1,
          category = $2,
          media_type = $3,
          image = $4,
          description = $5,
          tech = $6,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
      `, [
        project.title,
        project.category,
        project.mediaType,
        project.image,
        project.description,
        project.tech,
        project.id
      ]);
    } else {
      // Insert new project
      await pool.query(`
        INSERT INTO projects (site_id, title, category, media_type, image, description, tech)
        VALUES (1, $1, $2, $3, $4, $5, $6)
      `, [
        project.title,
        project.category,
        project.mediaType,
        project.image,
        project.description,
        project.tech
      ]);
    }

    res.json({ success: true, message: 'Project saved successfully' });
  } catch (err) {
    console.error('Error saving project:', err);
    res.status(500).json({ error: 'Failed to save project' });
  }
});

// Delete project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (password !== process.env.ADMIN_PASSWORD && password !== 'admin123') {
      return res.status(401).json({ error: 'Invalid password' });
    }

    await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Start server
const startServer = async () => {
  await initDatabase();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
