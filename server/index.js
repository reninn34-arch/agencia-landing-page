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
    
    // Create table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_content (
        id SERIAL PRIMARY KEY,
        content JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Insert default content if table is empty
    const result = await client.query('SELECT COUNT(*) FROM site_content');
    if (parseInt(result.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO site_content (content) VALUES ($1)
      `, [JSON.stringify(getDefaultContent())]);
    }
    
    client.release();
    console.log('Database initialized');
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
    const result = await pool.query('SELECT content FROM site_content ORDER BY id DESC LIMIT 1');
    if (result.rows.length === 0) {
      return res.json(getDefaultContent());
    }
    res.json(result.rows[0].content);
  } catch (err) {
    console.error('Error fetching content:', err);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Save content
app.post('/api/content', async (req, res) => {
  try {
    const { content, password } = req.body;
    
    // Verify password
    if (password !== process.env.ADMIN_PASSWORD && password !== 'admin123') {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    await pool.query(
      'UPDATE site_content SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM site_content ORDER BY id DESC LIMIT 1)',
      [JSON.stringify(content)]
    );
    
    res.json({ success: true, message: 'Content saved successfully' });
  } catch (err) {
    console.error('Error saving content:', err);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
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
