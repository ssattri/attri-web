import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const cmsPages = sqliteTable("cms_pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  status: text("status").notNull().default("draft"),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content").notNull().default(""),
  seoTitle: text("seo_title").notNull().default(""),
  seoDescription: text("seo_description").notNull().default(""),
  authorEmail: text("author_email").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  service: text("service").notNull().default(""),
  status: text("status").notNull().default("new"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  category: text("category").notNull(),
  location: text("location").notNull().default(""),
  status: text("status").notNull().default("draft"),
  description: text("description").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const appointments = sqliteTable("appointments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  service: text("service").notNull(),
  consultationMode: text("consultation_mode").notNull(),
  preferredDate: text("preferred_date").notNull(),
  preferredTime: text("preferred_time").notNull(),
  projectType: text("project_type").notNull().default(""),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("pending"),
  paymentStatus: text("payment_status").notNull().default("not-required"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  description: text("description").notNull().default(""),
  price: integer("price").notNull(),
  stock: integer("stock").notNull().default(0),
  status: text("status").notNull().default("active"),
  imageUrl: text("image_url").notNull().default(""),
  itemType: text("item_type").notNull().default("physical"),
  deliveryMode: text("delivery_mode").notNull().default("Online"),
  specialPrice: integer("special_price").notNull().default(0),
  specialFrom: text("special_from").notNull().default(""),
  specialTo: text("special_to").notNull().default(""),
  duration: text("duration").notNull().default(""),
  classes: integer("classes").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  metaTitle: text("meta_title").notNull().default(""),
  metaKeywords: text("meta_keywords").notNull().default(""),
  metaDescription: text("meta_description").notNull().default(""),
  serviceType: text("service_type").notNull().default(""),
  fulfillmentMode: text("fulfillment_mode").notNull().default(""),
  sku: text("sku").notNull().default(""),
  shortDescription: text("short_description").notNull().default(""),
  material: text("material").notNull().default(""),
  colour: text("colour").notNull().default(""),
  dimensions: text("dimensions").notNull().default(""),
  weight: text("weight").notNull().default(""),
  placement: text("placement").notNull().default(""),
  benefits: text("benefits").notNull().default(""),
  usageInstructions: text("usage_instructions").notNull().default(""),
  careInstructions: text("care_instructions").notNull().default(""),
  gstRate: integer("gst_rate").notNull().default(18),
  hsnCode: text("hsn_code").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  itemsJson: text("items_json").notNull(),
  subtotal: integer("subtotal").notNull(),
  shippingAmount: integer("shipping_amount").notNull().default(0),
  total: integer("total").notNull().default(0),
  paymentMethod: text("payment_method").notNull().default("pay-after-confirmation"),
  status: text("status").notNull().default("pending"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  trackingNumber: text("tracking_number").notNull().default(""),
  adminNotes: text("admin_notes").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const orderEvents = sqliteTable("order_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull(),
  status: text("status").notNull(),
  note: text("note").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  level: text("level").notNull().default("Beginner"),
  mode: text("mode").notNull().default("Recorded"),
  duration: text("duration").notNull().default(""),
  description: text("description").notNull().default(""),
  price: integer("price").notNull().default(0),
  lessons: integer("lessons").notNull().default(0),
  status: text("status").notNull().default("published"),
  imageUrl: text("image_url").notNull().default(""),
  instructor: text("instructor").notNull().default("Attri Academy Faculty"),
  certificate: integer("certificate").notNull().default(1),
  showInShop: integer("show_in_shop").notNull().default(1),
  metaTitle: text("meta_title").notNull().default(""),
  metaKeywords: text("meta_keywords").notNull().default(""),
  metaDescription: text("meta_description").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const enrollments = sqliteTable("enrollments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  courseId: integer("course_id").notNull(),
  studentName: text("student_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  experience: text("experience").notNull().default(""),
  status: text("status").notNull().default("pending"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  progress: integer("progress").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const supportTickets = sqliteTable("support_tickets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  customerEmail: text("customer_email").notNull(),
  subject: text("subject").notNull(),
  category: text("category").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("open"),
  priority: text("priority").notNull().default("normal"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const invoices = sqliteTable("invoices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  number: text("number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  description: text("description").notNull(),
  amount: integer("amount").notNull(),
  taxRate: integer("tax_rate").notNull().default(0),
  status: text("status").notNull().default("issued"),
  dueDate: text("due_date").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const clientReports = sqliteTable("client_reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  customerEmail: text("customer_email").notNull(),
  title: text("title").notNull(),
  reportType: text("report_type").notNull(),
  summary: text("summary").notNull(),
  findings: text("findings").notNull().default(""),
  recommendations: text("recommendations").notNull().default(""),
  status: text("status").notNull().default("draft"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const certificates = sqliteTable("certificates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  studentName: text("student_name").notNull(),
  studentEmail: text("student_email").notNull(),
  courseTitle: text("course_title").notNull(),
  issuedDate: text("issued_date").notNull(),
  status: text("status").notNull().default("issued"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const paymentRecords = sqliteTable("payment_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  purpose: text("purpose").notNull(),
  gateway: text("gateway").notNull(),
  transactionId: text("transaction_id").notNull().default(""),
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const workflowTasks = sqliteTable("workflow_tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  title: text("title").notNull(),
  assignee: text("assignee").notNull(),
  dueDate: text("due_date").notNull(),
  priority: text("priority").notNull().default("normal"),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const clientFiles = sqliteTable("client_files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  customerEmail: text("customer_email").notNull(),
  fileName: text("file_name").notNull(),
  objectKey: text("object_key").notNull().unique(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  category: text("category").notNull().default("Project file"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const customerProfiles = sqliteTable("customer_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull().default(""),
  company: text("company").notNull().default(""),
  address: text("address").notNull().default(""),
  city: text("city").notNull().default(""),
  state: text("state").notNull().default(""),
  pincode: text("pincode").notNull().default(""),
  gstin: text("gstin").notNull().default(""),
  status: text("status").notNull().default("active"),
  accountType: text("account_type").notNull().default(""),
  registrationCompleted: integer("registration_completed").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const portalNotifications = sqliteTable("portal_notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  audience: text("audience").notNull().default("all"),
  recipientEmail: text("recipient_email").notNull().default(""),
  severity: text("severity").notNull().default("info"),
  actionUrl: text("action_url").notNull().default(""),
  status: text("status").notNull().default("published"),
  expiresAt: text("expires_at").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const notificationReads = sqliteTable("notification_reads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  notificationId: integer("notification_id").notNull(),
  userEmail: text("user_email").notNull(),
  readAt: text("read_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const subscriptions = sqliteTable("subscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  customerEmail: text("customer_email").notNull(),
  accountType: text("account_type").notNull(),
  planName: text("plan_name").notNull(),
  billingCycle: text("billing_cycle").notNull().default("monthly"),
  amount: integer("amount").notNull().default(0),
  status: text("status").notNull().default("pending"),
  startsAt: text("starts_at").notNull().default(""),
  endsAt: text("ends_at").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const consultantProjects = sqliteTable("consultant_projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  ownerEmail: text("owner_email").notNull(),
  projectName: text("project_name").notNull(),
  clientName: text("client_name").notNull(),
  propertyType: text("property_type").notNull().default("Residence"),
  address: text("address").notNull().default(""),
  city: text("city").notNull().default(""),
  facing: text("facing").notNull().default("North"),
  compassRotation: integer("compass_rotation").notNull().default(0),
  floorPlanKey: text("floor_plan_key").notNull().default(""),
  floorPlanName: text("floor_plan_name").notNull().default(""),
  score: integer("score").notNull().default(0),
  findingsJson: text("findings_json").notNull().default("[]"),
  notes: text("notes").notNull().default(""),
  status: text("status").notNull().default("draft"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const consultantVastuReports = sqliteTable("consultant_vastu_reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  projectId: integer("project_id").notNull(),
  ownerEmail: text("owner_email").notNull(),
  clientEmail: text("client_email").notNull().default(""),
  title: text("title").notNull(),
  executiveSummary: text("executive_summary").notNull().default(""),
  findingsJson: text("findings_json").notNull().default("[]"),
  remediesJson: text("remedies_json").notNull().default("[]"),
  conclusion: text("conclusion").notNull().default(""),
  preparedBy: text("prepared_by").notNull().default(""),
  status: text("status").notNull().default("draft"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const staffMembers = sqliteTable("staff_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull().default(""),
  role: text("role").notNull(),
  department: text("department").notNull(),
  permissionsJson: text("permissions_json").notNull().default("[]"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const branches = sqliteTable("branches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull().default(""),
  mapUrl: text("map_url").notNull().default(""),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const serviceCatalog = sqliteTable("service_catalog", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  summary: text("summary").notNull().default(""),
  basePrice: integer("base_price").notNull().default(0),
  duration: text("duration").notNull().default(""),
  deliveryMode: text("delivery_mode").notNull().default("Online + On-site"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientName: text("client_name").notNull(),
  designation: text("designation").notNull().default(""),
  location: text("location").notNull().default(""),
  quote: text("quote").notNull(),
  rating: integer("rating").notNull().default(5),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const faqs = sqliteTable("faqs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull().default("General"),
  sortOrder: integer("sort_order").notNull().default(0),
  status: text("status").notNull().default("published"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const projectMilestones = sqliteTable("project_milestones", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  dueDate: text("due_date").notNull(),
  completion: integer("completion").notNull().default(0),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  recipientEmail: text("recipient_email").notNull(),
  channel: text("channel").notNull().default("email"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("queued"),
  scheduledAt: text("scheduled_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  sentAt: text("sent_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  actorEmail: text("actor_email").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull().default(""),
  detailsJson: text("details_json").notNull().default("{}"),
  ipAddress: text("ip_address").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value").notNull().default(""),
  valueType: text("value_type").notNull().default("text"),
  isPublic: integer("is_public", { mode: "boolean" }).notNull().default(false),
  updatedBy: text("updated_by").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
