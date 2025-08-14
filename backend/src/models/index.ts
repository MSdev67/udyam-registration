import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'udyam_registration',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

const UdyamRegistration = sequelize.define('UdyamRegistration', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  aadhaarNumber: {
    type: DataTypes.STRING(12),
    allowNull: false,
    validate: {
      is: /^\d{12}$/
    }
  },
  nameAsPerAadhaar: {
    type: DataTypes.STRING,
    allowNull: false
  },
  panNumber: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      is: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'verified', 'rejected'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'udyam_registrations',
  timestamps: true
});

export { sequelize, UdyamRegistration };