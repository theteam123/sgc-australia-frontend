/**
 * Enhanced Claude AI DocType Generator Service
 * Provides comprehensive DocType generation with advanced prompt engineering
 * and intelligent parsing to match web Claude.ai project capabilities
 */

import { projectKnowledge } from '../config/projectKnowledge.js';
import { erpnextDocTypeReferences } from '../config/erpnextDocTypeReferences.js';

/**
 * Generate DocType using Enhanced Claude AI Integration
 * @param {string} apiKey - Claude AI API key
 * @param {string} businessRequirements - Business requirements text
 * @returns {Object} Enhanced generated DocType and HTML mockup
 */
export const generateDocType = async (apiKey, businessRequirements) => {
  if (!apiKey || !businessRequirements) {
    throw new Error('API key and business requirements are required');
  }

  try {
    // Use local backend proxy instead of direct API call
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey,
        prompt: buildEnhancedPrompt(businessRequirements)
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
      throw new Error('Invalid response format from Claude API');
    }

    const responseText = data.content[0].text;
    return parseEnhancedClaudeResponse(responseText);

  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw new Error(`Failed to generate DocType: ${error.message}`);
  }
};

/**
 * Parse natural language query using Claude API
 * @param {string} query - The natural language query
 * @param {string} apiKey - Claude API key
 * @param {string} context - Either 'activities' or 'projects' to determine the context
 * @param {Array} availableItems - Array of available items (activities or projects) for context
 * @returns {Object} Parsed query result with filters
 */
export const parseNaturalLanguageQuery = async (query, apiKey, context = 'activities', availableItems = []) => {
  if (!apiKey || !query) {
    throw new Error('API key and query are required');
  }

  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey,
        prompt: buildQueryParsingPrompt(query, context, availableItems)
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Quietly handle AI service not being available or having issues
      if (response.status === 404) {
        throw new Error('AI service not available');
      }
      if (response.status >= 500) {
        throw new Error('AI service temporarily unavailable');
      }
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
      throw new Error('Invalid response format from Claude API');
    }

    const responseText = data.content[0].text;
    return parseQueryResponse(responseText, context);

  } catch (error) {
    // Only log errors that aren't expected AI service unavailability
    if (!error.message.includes('AI service not available') && !error.message.includes('AI service temporarily unavailable')) {
      console.error('Error parsing natural language query:', error);
    } else {
      console.warn('AI service unavailable, falling back to pattern matching');
    }
    throw new Error(`Failed to parse query: ${error.message}`);
  }
};

/**
 * Build Enhanced Prompt with Advanced Engineering
 * @param {string} requirements - Business requirements
 * @returns {string} Comprehensive prompt for Claude AI
 */
const buildEnhancedPrompt = (requirements) => {
  return `You are an expert DocType architect and UI/UX designer specializing in Frappe/ERPNext systems and modern web applications. You have deep expertise in business process analysis, database design, and creating intuitive user interfaces.

MISSION:
Transform business requirements into production-ready DocType JSON files and interactive HTML mockups that exceed enterprise-grade standards.

ENHANCED CAPABILITIES:
- Intelligent field type selection based on business context
- Advanced relationship modeling and data integrity
- Mobile-first responsive design with offline capabilities
- Automated workflow and business logic integration
- Performance-optimized database structures
- Comprehensive validation and security measures

BUSINESS REQUIREMENTS TO ANALYZE:
${requirements}

ADVANCED ANALYSIS FRAMEWORK:
Analyze the requirements using these dimensions:

1. BUSINESS PROCESS MAPPING:
   - Identify primary and secondary workflows
   - Map stakeholder interactions and permissions
   - Determine automation opportunities
   - Plan integration touchpoints

2. DATA ARCHITECTURE DESIGN:
   - Design optimal field structures and relationships
   - Plan data validation and integrity rules
   - Consider scalability and performance implications
   - Map required child tables and links

3. USER EXPERIENCE OPTIMIZATION:
   - Design intuitive form layouts and navigation
   - Plan mobile interactions and offline scenarios
   - Optimize for accessibility and usability
   - Consider role-based interface adaptations

4. TECHNICAL IMPLEMENTATION:
   - Select appropriate field types and configurations
   - Plan API integrations and external connections
   - Design security and permission structures
   - Consider deployment and maintenance requirements

${projectKnowledge}

${erpnextDocTypeReferences}

CRITICAL ERPNEXT VALIDATION RULES - STRICTLY FOLLOW THESE:

🚨 **TABLE FIELD RESTRICTIONS:**
- NEVER use "Table" or "Table MultiSelect" fields with these master DocTypes: Employee, Customer, Supplier, Item, User, Company, Project, Task, Lead, Opportunity, Account, Sales Order, Purchase Order, Quotation, Sales Invoice, Purchase Invoice, Delivery Note, Purchase Receipt, Journal Entry, Payment Entry, Stock Entry, Material Request, BOM, Work Order, Timesheet, Expense Claim, Leave Application, Salary Slip, Attendance, Holiday List, Department, Designation, Branch, Warehouse, UOM, Currency, Tax Rule, Price List, Shipping Rule, Terms and Conditions, Address, Contact, Communication, Event, ToDo, Note, File, Email Account, Print Format, Letter Head, Web Page, Blog Post, Website Settings
- NEVER create child DocTypes with names like: "Meeting Attendee", "Meeting Action Item", "Meeting Agenda Item", "Form Field", "Action Item", "Agenda Item", "Table Field", "Form Element", "Attendee", "Participant", "Member"
- NEVER use Table fields with options containing words: "Meeting", "Attendee", "Action", "Agenda", "Form", "Field", "Item", "Element", "Component", "Participant", "Member"

🔧 **PREFERRED ALTERNATIVES:**
- For employee selection: Use "Link" field with options "Employee" (single selection) or "Text" field for comma-separated names (multiple selection)
- For attendees/participants: Use "Text" field with description "Enter comma-separated names"
- For action items: Use "Text" field for manual entry
- For agenda items: Use "Text" field for manual entry
- For multiple selections: Use "Text" fields with descriptive placeholders

⚠️ **DOCTYPE PROPERTIES TO AVOID:**
- NEVER set "autoname" property - it causes validation issues
- NEVER set "naming_rule" property 
- ALWAYS set "is_submittable": 0 (not 1)
- NEVER set submit/cancel permissions to 1 in permissions array

✅ **SAFE PERMISSION STRUCTURE:**
\`\`\`json
"permissions": [
  {
    "role": "System Manager",
    "read": 1,
    "write": 1, 
    "create": 1,
    "delete": 1,
    "submit": 0,
    "cancel": 0,
    "amend": 0,
    "report": 1,
    "export": 1,
    "import": 1,
    "share": 1,
    "print": 1,
    "email": 1
  }
]
\`\`\`

🎯 **FIELD TYPE BEST PRACTICES:**
- Use "Link" fields for single master DocType references
- Use "Text" fields for multiple entries (comma-separated)
- Use "Data" fields for short text input
- Use "Text Editor" for rich formatting needs
- Use "Select" fields for predefined options only
- Use "Check" fields for boolean values
- Use "Date", "Time", "Datetime" for temporal data
- Use "Int", "Float", "Currency" for numeric data

📋 **STRUCTURE REQUIREMENTS:**
- Always include "custom": 1
- Always include "module": "Custom" (or user-specified module)
- Field names must be lowercase with underscores
- Field labels should be properly capitalized
- Include proper "reqd" flags (0 or 1, not boolean)
- Include "in_list_view": 1 for key fields

💡 **COMMON SCENARIOS - CORRECT APPROACHES:**

**Meeting Minutes DocType:**
- ❌ WRONG: "attendees" field as Table → "Meeting Attendee"
- ✅ CORRECT: "attendees" field as Text with description "Enter comma-separated attendee names"
- ❌ WRONG: "action_items" field as Table → "Meeting Action Item" 
- ✅ CORRECT: "action_items" field as Text with description "Enter action items details"

**Employee Selection:**
- ❌ WRONG: Table MultiSelect → Employee
- ✅ CORRECT: Link → Employee (single selection) OR Text field (multiple names)

**Form Builder DocType:**
- ❌ WRONG: "form_fields" as Table → "Form Field"
- ✅ CORRECT: "form_fields" as Text for field definitions

**JotForm Integration:**
- ❌ WRONG: "uploaded_files" as Table → "Form Attachment"
- ✅ CORRECT: "uploaded_files" as Text for file descriptions

🔄 **JOTFORM TO ERPNEXT CONVERSION GUIDE:**
- JotForm MultiSelect widgets → ERPNext Text fields with comma-separated values
- JotForm embedded employee lists → ERPNext Text fields for names
- JotForm table structures → ERPNext Text fields for structured data entry
- JotForm conditional logic → ERPNext field descriptions explaining dependencies

ENHANCED OUTPUT REQUIREMENTS:

Generate a comprehensive solution including:

1. **MAIN DOCTYPE JSON** - Production-ready DocType definition
2. **CHILD DOCTYPES** - If applicable, with proper relationships
3. **INTERACTIVE HTML MOCKUP** - Fully functional prototype
4. **IMPLEMENTATION GUIDE** - Deployment and usage instructions
5. **BUSINESS LOGIC NOTES** - Workflow and automation recommendations

ADVANCED FORMATTING REQUIREMENTS:

Format your response with clear section markers:

\`\`\`json-main-doctype
[Main DocType JSON here]
\`\`\`

\`\`\`json-child-doctypes
[Array of child DocType JSONs if applicable]
\`\`\`

\`\`\`html-mockup
[Complete HTML mockup with TheTeam App v3 styling]
\`\`\`

\`\`\`implementation-notes
[Comprehensive implementation guide and recommendations]
\`\`\`

\`\`\`business-logic
[Advanced workflow suggestions and automation opportunities]
\`\`\`

QUALITY STANDARDS:
- Enterprise-grade field validation and data integrity
- Mobile-optimized responsive design
- Accessibility compliance (WCAG 2.1)
- Performance optimization for large datasets
- Security best practices implementation
- Comprehensive error handling and user feedback
- Integration readiness with existing systems

ADVANCED FEATURES TO CONSIDER:
- Dynamic field visibility and conditional logic
- Automated calculations and data transformations
- Real-time collaboration and notifications
- Advanced search and filtering capabilities
- Audit trails and change tracking
- Bulk operations and data import/export
- Custom dashboards and reporting views
- API endpoints for external integrations

🔍 **FINAL VALIDATION CHECKLIST - VERIFY BEFORE RESPONDING:**
- ✅ No Table/Table MultiSelect fields reference master DocTypes (Employee, Customer, etc.)
- ✅ No Table fields reference non-existent child DocTypes (Meeting Attendee, etc.)
- ✅ No autoname or naming_rule properties in DocType JSON
- ✅ is_submittable is set to 0 (not 1)
- ✅ All permissions have submit: 0 and cancel: 0
- ✅ All field names are lowercase with underscores
- ✅ All reqd values are 0 or 1 (not boolean)
- ✅ All attendee/participant fields are Text fields, not Table fields
- ✅ custom: 1 is included in DocType JSON

Begin analysis and generation now, ensuring every aspect meets enterprise-grade standards and exceeds user expectations. DOUBLE-CHECK YOUR OUTPUT AGAINST THE VALIDATION RULES ABOVE.`;
};

/**
 * Parse Enhanced Claude Response with Advanced Extraction
 * @param {string} responseText - Raw Claude response
 * @returns {Object} Parsed DocType components with enhanced structure
 */
const parseEnhancedClaudeResponse = (responseText) => {
  console.log('Parsing Claude response:', responseText.substring(0, 500));

  const result = {
    mainDocType: null,
    childDocTypes: [],
    htmlMockup: '',
    implementationNotes: '',
    businessLogic: '',
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '2.0.0',
      quality: 'enterprise-grade'
    }
  };

  try {
    // Enhanced JSON extraction with multiple fallback patterns
    const mainDocTypeMatch = extractSectionContent(responseText, 'json-main-doctype') ||
                            extractSectionContent(responseText, 'json') ||
                            extractJsonFromText(responseText, 'Main DocType') ||
                            extractFirstJsonObject(responseText);

    if (mainDocTypeMatch) {
      result.mainDocType = JSON.parse(mainDocTypeMatch);
      console.log('Successfully parsed main DocType');
    }

    // Enhanced child DocTypes extraction
    const childDocTypesMatch = extractSectionContent(responseText, 'json-child-doctypes');
    if (childDocTypesMatch) {
      try {
        const childData = JSON.parse(childDocTypesMatch);
        result.childDocTypes = Array.isArray(childData) ? childData : [childData];
        console.log(`Successfully parsed ${result.childDocTypes.length} child DocTypes`);
      } catch (e) {
        console.log('Child DocTypes parsing failed, continuing without...');
      }
    }

    // Enhanced HTML mockup extraction
    result.htmlMockup = extractSectionContent(responseText, 'html-mockup') ||
                       extractSectionContent(responseText, 'html') ||
                       extractHtmlFromText(responseText) ||
                       generateFallbackHtml(result.mainDocType);

    // Enhanced implementation notes extraction
    result.implementationNotes = extractSectionContent(responseText, 'implementation-notes') ||
                                extractSectionContent(responseText, 'implementation') ||
                                extractTextSection(responseText, 'Implementation') ||
                                generateFallbackImplementationNotes(result.mainDocType);

    // Enhanced business logic extraction
    result.businessLogic = extractSectionContent(responseText, 'business-logic') ||
                          extractTextSection(responseText, 'Business Logic') ||
                          extractTextSection(responseText, 'Workflow') ||
                          generateFallbackBusinessLogic(result.mainDocType);

    // Quality validation
    validateGeneratedOutput(result);

    return result;

  } catch (error) {
    console.error('Enhanced parsing error:', error);
    throw new Error(`Failed to parse Claude response: ${error.message}. Please try again with more specific requirements.`);
  }
};

/**
 * Extract content between code block markers
 */
const extractSectionContent = (text, sectionType) => {
  const patterns = [
    new RegExp(`\`\`\`${sectionType}\\s*([\\s\\S]*?)\`\`\``, 'i'),
    new RegExp(`\`\`\`\\s*${sectionType}\\s*([\\s\\S]*?)\`\`\``, 'i'),
    new RegExp(`<${sectionType}>([\\s\\S]*?)</${sectionType}>`, 'i')
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
};

/**
 * Extract JSON from text with contextual markers
 */
const extractJsonFromText = (text, context) => {
  const lines = text.split('\n');
  let jsonStart = -1;
  let braceCount = 0;
  let jsonContent = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (jsonStart === -1 && (
        line.includes(context) ||
        line.match(/^\s*\{/) ||
        line.includes('"doctype"') ||
        line.includes('"name"')
    )) {
      jsonStart = i;
    }

    if (jsonStart !== -1) {
      jsonContent += line + '\n';
      
      for (const char of line) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
      }

      if (braceCount === 0 && jsonContent.trim().endsWith('}')) {
        try {
          return JSON.stringify(JSON.parse(jsonContent));
        } catch (e) {
          continue;
        }
      }
    }
  }
  return null;
};

/**
 * Extract first valid JSON object from text
 */
const extractFirstJsonObject = (text) => {
  const jsonRegex = /\{[\s\S]*?\}/g;
  const matches = text.match(jsonRegex);
  
  if (matches) {
    for (const match of matches) {
      try {
        const parsed = JSON.parse(match);
        if (parsed.doctype || parsed.name || parsed.fields) {
          return match;
        }
      } catch (e) {
        continue;
      }
    }
  }
  return null;
};

/**
 * Extract HTML from text with various patterns
 */
const extractHtmlFromText = (text) => {
  const htmlPatterns = [
    /<!DOCTYPE html>[\s\S]*?<\/html>/i,
    /<html[\s\S]*?<\/html>/i,
    /<div[\s\S]*?<\/div>/i
  ];

  for (const pattern of htmlPatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return null;
};

/**
 * Extract text sections with headers
 */
const extractTextSection = (text, sectionName) => {
  const patterns = [
    new RegExp(`#{1,3}\\s*${sectionName}[\\s\\S]*?(?=#{1,3}|$)`, 'i'),
    new RegExp(`\\*\\*${sectionName}\\*\\*[\\s\\S]*?(?=\\*\\*|$)`, 'i'),
    new RegExp(`${sectionName}:?\\s*\\n([\\s\\S]*?)(?=\\n\\n|$)`, 'i')
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return null;
};

/**
 * Generate fallback HTML if extraction fails
 */
const generateFallbackHtml = (docType) => {
  if (!docType) return '<p>HTML mockup generation failed</p>';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${docType.name || 'Generated DocType'} - TheTeam App v3</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-gray-50">
    <div class="max-w-4xl mx-auto p-6">
        <div class="bg-white rounded-lg shadow p-6">
            <h1 class="text-2xl font-bold text-gray-900 mb-4">${docType.name || 'Generated DocType'}</h1>
            <p class="text-gray-600">Interactive mockup generation failed. Please regenerate with more specific requirements.</p>
        </div>
    </div>
</body>
</html>`;
};

/**
 * Generate fallback implementation notes
 */
const generateFallbackImplementationNotes = (docType) => {
  if (!docType) return 'Implementation notes generation failed';
  
  return `# Implementation Guide for ${docType.name || 'Generated DocType'}

## Quick Start
1. Import the DocType JSON file into your ERPNext instance
2. Run database migrations if needed
3. Set up user permissions
4. Test the form functionality

## Deployment Steps
1. Navigate to Developer > DocType
2. Click "Import DocType"
3. Upload the generated JSON file
4. Configure permissions as needed

## Integration Points
- Consider API endpoints for external systems
- Set up automation rules if applicable
- Configure email notifications
- Plan data migration if replacing existing forms`;
};

/**
 * Generate fallback business logic notes
 */
const generateFallbackBusinessLogic = (docType) => {
  if (!docType) return 'Business logic notes generation failed';
  
  return `# Business Logic Recommendations for ${docType.name || 'Generated DocType'}

## Workflow Automation
- Consider implementing automated status transitions
- Set up notification rules for key stakeholders
- Plan integration with existing business processes

## Data Validation
- Implement field validation rules
- Set up dependent field calculations
- Consider bulk operations for efficiency

## Reporting & Analytics
- Plan dashboard views for key metrics
- Set up automated reports
- Consider data export capabilities`;
};

/**
 * Build Query Parsing Prompt for Natural Language Search
 * @param {string} query - Natural language search query
 * @param {string} context - Either 'activities' or 'projects' to determine the context
 * @param {Array} availableItems - Array of available items for context
 * @returns {string} Comprehensive prompt for query parsing
 */
const buildQueryParsingPrompt = (query, context = 'activities', availableItems = []) => {
  let itemContext = '';
  let filterTypes = '';
  let exampleQueries = '';
  
  if (context === 'projects') {
    itemContext = availableItems.length > 0 ? 
      `\n\nAVAILABLE PROJECTS FOR CONTEXT:\n${availableItems.map(project => 
        `- "${project.project_name}" (Code: ${project.project_code}, Status: ${project.status}, Division: ${project.division || 'N/A'}, Value: ${project.project_value || 0})`
      ).join('\n')}` : '';
      
    filterTypes = `AVAILABLE FILTER TYPES:
1. **Status Filters**: Opportunity, Estimate, Project, Archived, Active, Planning, Completed, On Hold
2. **Division Filters**: PRO, ADM, AUT, ELC, TSD
3. **Value Filters**: Ranges like 0-50000, 50000-100000, 100000-500000, 500000+
4. **Margin Filters**: Ranges like negative, 0-10, 10-20, 20+
5. **Text Filters**: Project name contains, starts with, or exact matches
6. **Client Filters**: Organisation/client name contains`;

    exampleQueries = `EXAMPLE QUERIES AND EXPECTED RESPONSES:
"projects worth more than 500k" → {"valueRange": "500000+", "interpretation": "Projects worth more than $500,000"}
"completed PRO division projects" → {"status": "completed", "division": "PRO", "interpretation": "Completed projects in PRO division"}
"margin less than 10%" → {"marginRange": "0-10", "interpretation": "Projects with margin less than 10%"}`;
  } else {
    itemContext = availableItems.length > 0 ? 
      `\n\nAVAILABLE ACTIVITIES FOR CONTEXT:\n${availableItems.map(activity => 
        `- "${activity.name}" (Status: ${activity.status}, Progress: ${activity.progress || 0}%, Estimated Hours: ${activity.estimated_hours || 0})`
      ).join('\n')}` : '';
      
    filterTypes = `AVAILABLE FILTER TYPES:
1. **Status Filters**: Open, Estimate, Working, Pending Review, Overdue, Template, Completed, Cancelled
2. **Progress Filters**: Exact percentage (0-100) or ranges (e.g., 1-25, 26-50, etc.)
3. **Text Filters**: Activity name contains, starts with, or exact matches
4. **Date Filters**: Start date, end date, date ranges
5. **Semantic Filters**: Activities that have "commenced" (progress > 0), "in progress" (progress 1-99%), "not started" (progress = 0)
6. **Estimated Hours Filters**: Greater than, less than, or within ranges`;

    exampleQueries = `EXAMPLE QUERIES AND EXPECTED RESPONSES:
"open with less than 200 hours" → {"status": "open", "estimatedHours": {"operator": "less", "value": 200}, "interpretation": "Open activities with estimated hours less than 200"}
"completed estimates" → {"status": "estimate", "progress": 100, "interpretation": "Completed estimate activities"}
"activities starting this week" → {"startDateRange": {"start": "2024-12-09", "end": "2024-12-15"}, "interpretation": "Activities starting this week"}`;
  }

  return `You are an intelligent search query parser for a project management system. Your task is to analyze natural language search queries and convert them into structured filters for ${context}.

QUERY TO ANALYZE: "${query}"${itemContext}

${filterTypes}

${exampleQueries}
6. **Estimated Hours Filters**: Activities with estimated hours greater than, less than, or equal to specific values

INTELLIGENT PARSING RULES:
- "commenced", "started", "begun" = activities with progress > 0%
- "in progress", "active", "working" = activities with progress 1-99%
- "not started", "new", "pending" = activities with progress = 0%
- "completed", "finished", "done" = activities with progress = 100% OR status = "Completed"
- "estimates", "quotes" = status = "Estimate"
- **Hours patterns**: "estimated hours greater than 100", "hours > 50", "more than 200 hours", "large tasks", "small tasks" (< 40 hours)
- **Large tasks**: "large tasks", "big activities", "major work" = estimated hours > 100
- **Small tasks**: "small tasks", "quick activities", "minor work" = estimated hours < 40
- Date references like "this week", "next month", "overdue" should be converted to date ranges
- Month references: "starting in july", "july activities", "ending in december" = date range for that month
- Year references: "starting in 2025", "2024 activities" = date range for that year
- Relative dates: "this month", "next week", "last quarter" = calculate relative to current date (July 2025)
- Handle typos and variations (e.g., "recrutment" should match "Recruitment")
- Consider context from available activities to suggest relevant matches

RESPONSE FORMAT (JSON):
{
  "interpretation": "Human-readable description of what the search is looking for",
  "confidence": 0.95,
  "filters": {
    "status": "Working" | null,
    "progressRange": {"min": 1, "max": 100} | null,
    "progress": 50 | null,
    "nameContains": "text" | null,
    "nameStartsWith": "text" | null,
    "nameExact": "text" | null,
    "dateRange": {"start": "2025-01-01", "end": "2025-01-31"} | null,
    "startDateRange": {"start": "2025-07-01", "end": "2025-07-31"} | null,
    "endDateRange": {"start": "2025-12-01", "end": "2025-12-31"} | null,
    "isOverdue": true | false | null,
    "semantic": "commenced" | "in-progress" | "not-started" | "completed" | null,
    "estimatedHours": {"operator": "greater" | "less" | "equal", "value": 100} | null
  },
  "suggestions": ["Alternative search suggestions if applicable"],
  "matchedActivities": ["List of activity names that might match based on available context"]
}

EXAMPLES:
Query: "show me recruitment activities"
Response: {
  "interpretation": "Activities containing 'recruitment' in the name",
  "confidence": 0.9,
  "filters": {"nameContains": "recruitment"},
  "suggestions": ["recruitment process", "hiring activities"],
  "matchedActivities": ["Recruitment Process"]
}

Query: "activities that have commenced"
Response: {
  "interpretation": "Activities that have started (progress greater than 0%)",
  "confidence": 0.95,
  "filters": {"semantic": "commenced", "progressRange": {"min": 1, "max": 100}},
  "suggestions": ["in progress activities", "active work"],
  "matchedActivities": []
}

Query: "show estimates"
Response: {
  "interpretation": "Activities with Estimate status",
  "confidence": 0.9,
  "filters": {"status": "Estimate"},
  "suggestions": ["estimation activities", "quote activities"],
  "matchedActivities": []
}

Query: "starting in july"
Response: {
  "interpretation": "Activities that start in July 2025",
  "confidence": 0.95,
  "filters": {"startDateRange": {"start": "2025-07-01", "end": "2025-07-31"}},
  "suggestions": ["july activities", "summer activities", "activities starting this month"],
  "matchedActivities": []
}

Query: "ending in december"
Response: {
  "interpretation": "Activities that end in December 2025",
  "confidence": 0.95,
  "filters": {"endDateRange": {"start": "2025-12-01", "end": "2025-12-31"}},
  "suggestions": ["december deadlines", "year-end activities"],
  "matchedActivities": []
}

Query: "estimated hours greater than 100"
Response: {
  "interpretation": "Activities with estimated hours greater than 100",
  "confidence": 0.95,
  "filters": {"estimatedHours": {"operator": "greater", "value": 100}},
  "suggestions": ["large tasks", "major activities", "complex work"],
  "matchedActivities": []
}

Query: "large tasks"
Response: {
  "interpretation": "Large activities with significant time requirements (estimated hours > 100)",
  "confidence": 0.85,
  "filters": {"estimatedHours": {"operator": "greater", "value": 100}},
  "suggestions": ["major work", "complex activities", "estimated hours > 100"],
  "matchedActivities": []
}

Analyze the query and provide a JSON response following this exact format. Be intelligent about understanding user intent and provide helpful suggestions.`;
};

/**
 * Parse Claude AI Response for Query Analysis
 * @param {string} responseText - Raw response from Claude AI
 * @param {string} context - Context type ('activities' or 'projects')
 * @returns {Object} Parsed query filters and interpretation
 */
const parseQueryResponse = (responseText, context = 'activities') => {
  try {
    // Extract JSON from response (it might be wrapped in markdown or other text)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);
    
    // Validate the response structure
    if (!parsedResponse.interpretation || !parsedResponse.filters) {
      throw new Error('Invalid response structure');
    }

    // Use context-appropriate matched items property
    const matchedItemsKey = context === 'projects' ? 'matchedProjects' : 'matchedActivities';
    const matchedItems = parsedResponse[matchedItemsKey] || parsedResponse.matchedActivities || [];

    return {
      isAiParsed: true,
      interpretation: parsedResponse.interpretation,
      confidence: parsedResponse.confidence || 0.8,
      filters: parsedResponse.filters,
      suggestions: parsedResponse.suggestions || [],
      matchedActivities: context === 'activities' ? matchedItems : [],
      matchedProjects: context === 'projects' ? matchedItems : [],
      isNaturalLanguage: true
    };

  } catch (error) {
    console.error('Error parsing Claude response:', error);
    // Fallback to basic text search
    return {
      isAiParsed: false,
      interpretation: `Text search for "${responseText.slice(0, 50)}..."`,
      confidence: 0.3,
      filters: {
        nameContains: responseText.slice(0, 100) // Use first 100 chars as fallback
      },
      suggestions: [],
      matchedActivities: [],
      isNaturalLanguage: true
    };
  }
};

/**
 * Validate the generated output quality
 */
const validateGeneratedOutput = (result) => {
  const issues = [];

  if (!result.mainDocType) {
    issues.push('Main DocType generation failed');
  } else {
    if (!result.mainDocType.name) issues.push('DocType missing name');
    if (!result.mainDocType.fields || result.mainDocType.fields.length === 0) {
      issues.push('DocType missing fields');
    }
  }

  if (!result.htmlMockup || result.htmlMockup.length < 100) {
    issues.push('HTML mockup is too short or missing');
  }

  if (!result.implementationNotes || result.implementationNotes.length < 50) {
    issues.push('Implementation notes are insufficient');
  }

  if (issues.length > 0) {
    console.warn('Generation quality issues:', issues);
    result.metadata.qualityIssues = issues;
    result.metadata.quality = 'needs-improvement';
  }

  result.metadata.validatedAt = new Date().toISOString();
};

// Export additional utilities for advanced usage
export const utils = {
  validateDocType: (docType) => {
    // Add DocType validation logic
    return true;
  },
  
  optimizeFields: (fields) => {
    // Add field optimization logic
    return fields;
  },
  
  generateApiEndpoints: (docType) => {
    // Generate suggested API endpoints
    return [];
  }
}; 