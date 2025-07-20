<template>
  <div class="project-dashboard">
    <!-- Financial Overview - Top Priority Widget -->
    <div class="monday-card financial-overview">
      <div class="monday-card-header">
        <h2 class="text-h2 text-monday-dark">Financial Overview</h2>
        <div class="flex items-center gap-2">
          <span class="text-small text-monday-medium">{{ projects.length }} Projects</span>
          <div class="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
        </div>
      </div>
      <div class="monday-card-body">
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div class="financial-metric">
            <div class="metric-icon bg-gradient-to-br from-primary-green to-accent-green">
              <DollarSignIcon class="w-6 h-6 text-white" />
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ formatCurrency(totalProjectValue) }}</div>
              <div class="metric-label">Total Value</div>
            </div>
          </div>
          <div class="financial-metric">
            <div class="metric-icon bg-gradient-to-br from-accent-green to-secondary-green">
              <TrendingUpIcon class="w-6 h-6 text-white" />
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ formatCurrency(totalRevenue) }}</div>
              <div class="metric-label">Est. Revenue</div>
            </div>
          </div>
          <div class="financial-metric">
            <div class="metric-icon bg-gradient-to-br from-monday-orange to-monday-red">
              <MinusIcon class="w-6 h-6 text-white" />
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ formatCurrency(totalCost) }}</div>
              <div class="metric-label">Total Cost</div>
            </div>
          </div>
          <div class="financial-metric">
            <div class="metric-icon bg-gradient-to-br from-secondary-green to-primary-green">
              <PlusIcon class="w-6 h-6 text-white" />
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ formatCurrency(totalMargin) }}</div>
              <div class="metric-label">Margin</div>
            </div>
          </div>
          <div class="financial-metric">
            <div class="metric-icon bg-gradient-to-br from-primary-green to-monday-orange">
              <PercentIcon class="w-6 h-6 text-white" />
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ avgMarginPercent }}%</div>
              <div class="metric-label">Margin %</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Project Status Widget -->
      <div class="monday-card monday-hover-lift">
        <div class="monday-card-header">
          <h3 class="text-h3 text-monday-dark flex items-center gap-2">
            <ActivityIcon class="w-5 h-5 text-primary-green" />
            Project Status
          </h3>
        </div>
        <div class="monday-card-body">
          <div class="status-grid">
            <div class="status-item" v-for="status in statusStats" :key="status.name">
              <div class="status-indicator" :class="status.color"></div>
              <div class="status-info">
                <div class="status-count">{{ status.count }}</div>
                <div class="status-label">{{ status.name }}</div>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: completionRate + '%' }"></div>
            </div>
            <div class="text-small text-monday-medium mt-2">{{ completionRate }}% completion rate</div>
          </div>
        </div>
      </div>

      <!-- Timeline Widget -->
      <div class="monday-card monday-hover-lift">
        <div class="monday-card-header">
          <h3 class="text-h3 text-monday-dark flex items-center gap-2">
            <CalendarIcon class="w-5 h-5 text-accent-green" />
            Timeline
          </h3>
        </div>
        <div class="monday-card-body">
          <div class="timeline-stats">
            <div class="timeline-item">
              <div class="timeline-icon bg-accent-green">
                <PlayIcon class="w-4 h-4 text-white" />
              </div>
              <div class="timeline-content">
                <div class="timeline-count">{{ startingSoon }}</div>
                <div class="timeline-label">Starting Soon</div>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-icon bg-monday-orange">
                <ClockIcon class="w-4 h-4 text-white" />
              </div>
              <div class="timeline-content">
                <div class="timeline-count">{{ inProgress }}</div>
                <div class="timeline-label">In Progress</div>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-icon bg-monday-red">
                <AlertTriangleIcon class="w-4 h-4 text-white" />
              </div>
              <div class="timeline-content">
                <div class="timeline-count">{{ overdue }}</div>
                <div class="timeline-label">Overdue</div>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-icon bg-secondary-green">
                <CheckIcon class="w-4 h-4 text-white" />
              </div>
              <div class="timeline-content">
                <div class="timeline-count">{{ completed }}</div>
                <div class="timeline-label">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance KPIs -->
      <div class="monday-card monday-hover-lift">
        <div class="monday-card-header">
          <h3 class="text-h3 text-monday-dark flex items-center gap-2">
            <BarChart3Icon class="w-5 h-5 text-secondary-green" />
            Performance
          </h3>
        </div>
        <div class="monday-card-body">
          <div class="kpi-grid">
            <div class="kpi-item">
              <div class="kpi-score">{{ avgPVAScore }}</div>
              <div class="kpi-label">Avg PVA Score</div>
              <div class="kpi-bar">
                <div class="kpi-fill" :style="{ width: (avgPVAScore / 10) * 100 + '%' }"></div>
              </div>
            </div>
            <div class="kpi-item">
              <div class="kpi-score">{{ highProbProjects }}</div>
              <div class="kpi-label">High Probability</div>
              <div class="kpi-bar">
                <div class="kpi-fill success" :style="{ width: (highProbProjects / projects.length) * 100 + '%' }"></div>
              </div>
            </div>
            <div class="kpi-item">
              <div class="kpi-score">{{ labourUtilization }}%</div>
              <div class="kpi-label">Labour Utilization</div>
              <div class="kpi-bar">
                <div class="kpi-fill warning" :style="{ width: labourUtilization + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Industry & Client Analysis -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Industry Sectors -->
      <div class="monday-card monday-hover-lift">
        <div class="monday-card-header">
          <h3 class="text-h3 text-monday-dark flex items-center gap-2">
            <BuildingIcon class="w-5 h-5 text-primary-green" />
            Industry Sectors
          </h3>
        </div>
        <div class="monday-card-body">
          <div class="industry-list">
            <div class="industry-item" v-for="industry in industryStats" :key="industry.name">
              <div class="industry-info">
                <div class="industry-name">{{ industry.name }}</div>
                <div class="industry-count">{{ industry.count }} projects</div>
              </div>
              <div class="industry-value">{{ formatCurrency(industry.value) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Client Relationships -->
      <div class="monday-card monday-hover-lift">
        <div class="monday-card-header">
          <h3 class="text-h3 text-monday-dark flex items-center gap-2">
            <UsersIcon class="w-5 h-5 text-accent-green" />
            Client Relations
          </h3>
        </div>
        <div class="monday-card-body">
          <div class="client-stats">
            <div class="client-metric">
              <div class="client-icon bg-accent-green">
                <HeartIcon class="w-4 h-4 text-white" />
              </div>
              <div class="client-content">
                <div class="client-count">{{ excellentRelations }}</div>
                <div class="client-label">Excellent Relations</div>
              </div>
            </div>
            <div class="client-metric">
              <div class="client-icon bg-secondary-green">
                <ThumbsUpIcon class="w-4 h-4 text-white" />
              </div>
              <div class="client-content">
                <div class="client-count">{{ goodRelations }}</div>
                <div class="client-label">Good Relations</div>
              </div>
            </div>
            <div class="client-metric">
              <div class="client-icon bg-monday-orange">
                <MinusIcon class="w-4 h-4 text-white" />
              </div>
              <div class="client-content">
                <div class="client-count">{{ neutralRelations }}</div>
                <div class="client-label">Neutral Relations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Projects Table -->
    <div class="monday-card">
      <div class="monday-card-header">
        <h3 class="text-h3 text-monday-dark flex items-center gap-2">
          <FolderIcon class="w-5 h-5 text-primary-green" />
          Recent Projects
        </h3>
        <button class="btn-monday btn-secondary btn-small">View All</button>
      </div>
      <div class="monday-card-body">
        <div class="monday-table">
          <table class="w-full">
            <thead>
              <tr>
                <th class="monday-table-header text-left">Project</th>
                <th class="monday-table-header text-left">Client</th>
                <th class="monday-table-header text-left">Status</th>
                <th class="monday-table-header text-left">Value</th>
                <th class="monday-table-header text-left">Probability</th>
                <th class="monday-table-header text-left">Timeline</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in recentProjects" :key="project.id" class="monday-table-row group">
                <td class="monday-table-cell">
                  <div class="flex items-center gap-3">
                    <div class="project-icon">
                      <FolderIcon class="w-4 h-4 text-primary-green" />
                    </div>
                    <div>
                      <div class="text-label text-monday-dark">{{ project.project_name }}</div>
                      <div class="text-small text-monday-medium">{{ project.project_code }}</div>
                    </div>
                  </div>
                </td>
                <td class="monday-table-cell">
                  <div class="text-body text-monday-dark">{{ project.organisation }}</div>
                </td>
                <td class="monday-table-cell">
                  <span class="status-badge" :class="getStatusClass(project.status)">
                    {{ project.status }}
                  </span>
                </td>
                <td class="monday-table-cell">
                  <div class="text-label text-monday-dark">{{ formatCurrency(project.project_value) }}</div>
                </td>
                <td class="monday-table-cell">
                  <div class="probability-indicator">
                    <div class="probability-bar">
                      <div class="probability-fill" :style="{ width: project.probability + '%' }"></div>
                    </div>
                    <span class="text-small text-monday-medium">{{ project.probability }}%</span>
                  </div>
                </td>
                <td class="monday-table-cell">
                  <div class="text-small text-monday-medium">{{ formatDate(project.project_end_date) }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  DollarSignIcon,
  TrendingUpIcon,
  MinusIcon,
  PlusIcon,
  PercentIcon,
  ActivityIcon,
  CalendarIcon,
  PlayIcon,
  ClockIcon,
  AlertTriangleIcon,
  CheckIcon,
  BarChart3Icon,
  BuildingIcon,
  UsersIcon,
  HeartIcon,
  ThumbsUpIcon,
  FolderIcon
} from 'lucide-vue-next';
import { getSampleProjects } from '../services/projects';

interface Project {
  id: string;
  organisation: string;
  contact: string;
  project_code: string;
  project_name: string;
  division: string;
  project_type: string;
  status: string;
  work_type: string;
  industry_sector: string;
  project_start_date: string;
  project_end_date: string;
  reputation: string;
  relationship: string;
  client_positioning: string;
  project_value: number;
  probability: number;
  estimated_revenue: number;
  estimated_total_cost: number;
  estimated_margin: number;
  estimated_margin_percent: number;
  pva_score: number;
  likelyhood_of_works: number;
  estimated_hours: number;
  labour_hours: number;
}

// Projects data
const projects = ref<Project[]>([]);

// Load sample data - replace with actual API call
const loadProjects = () => {
  projects.value = getSampleProjects();
};

// Original sample data for reference (now moved to service)
const sampleProjects = [
  {
    id: '1',
    organisation: 'Mining Corp Australia',
    contact: 'Sarah Johnson',
    code: 'MCA-2024-001',
    name: 'Queensland Mining Expansion',
    division: 'Mining',
    type: 'Infrastructure',
    status: 'Active',
    workType: 'Construction',
    industrySector: 'Mining',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    reputation: 'Excellent',
    relationship: 'Strong',
    clientPositioning: 'Preferred',
    value: 2500000,
    probability: 85,
    estimatedRevenue: 2200000,
    estimatedTotalCost: 1800000,
    estimatedMargin: 400000,
    estimatedMarginPercent: 18,
    pvaScore: 8.5,
    likelihoodOfWorks: 90,
    estimatedHours: 5000,
    labourHours: 3500
  },
  {
    id: '2',
    organisation: 'Tech Solutions Pty',
    contact: 'Michael Chen',
    code: 'TSP-2024-002',
    name: 'Digital Infrastructure Upgrade',
    division: 'Technology',
    type: 'Software',
    status: 'Planning',
    workType: 'Development',
    industrySector: 'Technology',
    startDate: '2024-03-01',
    endDate: '2024-08-15',
    reputation: 'Good',
    relationship: 'Good',
    clientPositioning: 'Competitive',
    value: 750000,
    probability: 65,
    estimatedRevenue: 680000,
    estimatedTotalCost: 550000,
    estimatedMargin: 130000,
    estimatedMarginPercent: 19,
    pvaScore: 7.2,
    likelihoodOfWorks: 70,
    estimatedHours: 2000,
    labourHours: 1200
  },
  {
    id: '3',
    organisation: 'Green Energy Ltd',
    contact: 'Emma Wilson',
    code: 'GEL-2024-003',
    name: 'Solar Farm Development',
    division: 'Energy',
    type: 'Infrastructure',
    status: 'Completed',
    workType: 'Construction',
    industrySector: 'Energy',
    startDate: '2023-06-01',
    endDate: '2024-02-28',
    reputation: 'Excellent',
    relationship: 'Strong',
    clientPositioning: 'Preferred',
    value: 1800000,
    probability: 100,
    estimatedRevenue: 1620000,
    estimatedTotalCost: 1350000,
    estimatedMargin: 270000,
    estimatedMarginPercent: 17,
    pvaScore: 9.1,
    likelihoodOfWorks: 100,
    estimatedHours: 4500,
    labourHours: 4500
  }
];

// Use the service data instead of local sample data
// projects.value = sampleProjects;

// Computed properties for statistics
const totalProjectValue = computed(() => 
  projects.value.reduce((sum, p) => sum + p.project_value, 0)
);

const totalRevenue = computed(() => 
  projects.value.reduce((sum, p) => sum + p.estimated_revenue, 0)
);

const totalCost = computed(() => 
  projects.value.reduce((sum, p) => sum + p.estimated_total_cost, 0)
);

const totalMargin = computed(() => 
  projects.value.reduce((sum, p) => sum + p.estimated_margin, 0)
);

const avgMarginPercent = computed(() => {
  const avg = projects.value.reduce((sum, p) => sum + p.estimated_margin_percent, 0) / projects.value.length;
  return Math.round(avg * 10) / 10;
});

const statusStats = computed(() => {
  const stats = projects.value.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return [
    { name: 'Active', count: stats.Active || 0, color: 'bg-accent-green' },
    { name: 'Planning', count: stats.Planning || 0, color: 'bg-monday-orange' },
    { name: 'Completed', count: stats.Completed || 0, color: 'bg-secondary-green' },
    { name: 'On Hold', count: stats['On Hold'] || 0, color: 'bg-monday-red' }
  ];
});

const completionRate = computed(() => {
  const completed = projects.value.filter(p => p.status === 'Completed').length;
  return Math.round((completed / projects.value.length) * 100);
});

const startingSoon = computed(() => {
  const now = new Date();
  const soon = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  return projects.value.filter(p => 
    new Date(p.project_start_date) > now && new Date(p.project_start_date) <= soon
  ).length;
});

const inProgress = computed(() => 
  projects.value.filter(p => p.status === 'Active').length
);

const overdue = computed(() => {
  const now = new Date();
  return projects.value.filter(p => 
    new Date(p.project_end_date) < now && p.status !== 'Completed'
  ).length;
});

const completed = computed(() => 
  projects.value.filter(p => p.status === 'Completed').length
);

const avgPVAScore = computed(() => {
  const avg = projects.value.reduce((sum, p) => sum + p.pva_score, 0) / projects.value.length;
  return Math.round(avg * 10) / 10;
});

const highProbProjects = computed(() => 
  projects.value.filter(p => p.probability >= 80).length
);

const labourUtilization = computed(() => {
  const total = projects.value.reduce((sum, p) => sum + p.estimated_hours, 0);
  const used = projects.value.reduce((sum, p) => sum + p.labour_hours, 0);
  return Math.round((used / total) * 100);
});

const industryStats = computed(() => {
  const stats = projects.value.reduce((acc, p) => {
    if (!acc[p.industry_sector]) {
      acc[p.industry_sector] = { count: 0, value: 0 };
    }
    acc[p.industry_sector].count++;
    acc[p.industry_sector].value += p.project_value;
    return acc;
  }, {} as Record<string, { count: number; value: number }>);

  return Object.entries(stats).map(([name, data]) => ({
    name,
    count: data.count,
    value: data.value
  }));
});

const excellentRelations = computed(() => 
  projects.value.filter(p => p.relationship === 'Strong').length
);

const goodRelations = computed(() => 
  projects.value.filter(p => p.relationship === 'Good').length
);

const neutralRelations = computed(() => 
  projects.value.filter(p => p.relationship === 'Neutral').length
);

const recentProjects = computed(() => 
  projects.value.slice(0, 5)
);

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusClass = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Active': 'status-done',
    'Planning': 'status-working',
    'Completed': 'status-done',
    'On Hold': 'status-stuck'
  };
  return statusMap[status] || 'status-blank';
};

onMounted(() => {
  loadProjects();
});
</script>

<style scoped>
@import '../styles/monday-design-system.css';

.project-dashboard {
  padding: 0;
  gap: 1.5rem;
  display: flex;
  flex-direction: column;
}

/* Financial Overview */
.financial-overview {
  background: linear-gradient(135deg, var(--monday-white) 0%, var(--monday-very-light) 100%);
  border: 1px solid var(--primary-green-light);
}

.financial-metric {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--monday-white);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-small);
  transition: all 0.3s ease;
}

.financial-metric:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-large);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--monday-dark);
  line-height: 1.2;
}

.metric-label {
  font-size: 0.875rem;
  color: var(--monday-medium);
  margin-top: 0.25rem;
}

/* Status Grid */
.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--monday-very-light);
  border-radius: var(--border-radius-medium);
  transition: all 0.2s ease;
}

.status-item:hover {
  background: var(--monday-light);
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-count {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--monday-dark);
}

.status-label {
  font-size: 0.875rem;
  color: var(--monday-medium);
}

/* Timeline Stats */
.timeline-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: var(--border-radius-medium);
  transition: all 0.2s ease;
}

.timeline-item:hover {
  background: var(--monday-very-light);
}

.timeline-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.timeline-count {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--monday-dark);
}

.timeline-label {
  font-size: 0.875rem;
  color: var(--monday-medium);
}

/* KPI Grid */
.kpi-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.kpi-item {
  text-align: center;
}

.kpi-score {
  font-size: 2rem;
  font-weight: 700;
  color: var(--monday-dark);
  margin-bottom: 0.5rem;
}

.kpi-label {
  font-size: 0.875rem;
  color: var(--monday-medium);
  margin-bottom: 0.75rem;
}

.kpi-bar {
  height: 6px;
  background: var(--monday-light);
  border-radius: 3px;
  overflow: hidden;
}

.kpi-fill {
  height: 100%;
  background: var(--primary-green);
  transition: width 0.3s ease;
}

.kpi-fill.success {
  background: var(--accent-green);
}

.kpi-fill.warning {
  background: var(--monday-orange);
}

/* Industry List */
.industry-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.industry-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--monday-very-light);
  border-radius: var(--border-radius-medium);
  transition: all 0.2s ease;
}

.industry-item:hover {
  background: var(--monday-light);
}

.industry-name {
  font-weight: 500;
  color: var(--monday-dark);
}

.industry-count {
  font-size: 0.875rem;
  color: var(--monday-medium);
}

.industry-value {
  font-weight: 600;
  color: var(--primary-green);
}

/* Client Stats */
.client-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.client-metric {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--monday-very-light);
  border-radius: var(--border-radius-medium);
  transition: all 0.2s ease;
}

.client-metric:hover {
  background: var(--monday-light);
}

.client-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.client-count {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--monday-dark);
}

.client-label {
  font-size: 0.875rem;
  color: var(--monday-medium);
}

/* Table Enhancements */
.project-icon {
  width: 32px;
  height: 32px;
  background: var(--primary-green-light);
  border-radius: var(--border-radius-medium);
  display: flex;
  align-items: center;
  justify-content: center;
}

.probability-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.probability-bar {
  width: 60px;
  height: 4px;
  background: var(--monday-light);
  border-radius: 2px;
  overflow: hidden;
}

.probability-fill {
  height: 100%;
  background: var(--accent-green);
  transition: width 0.3s ease;
}

/* Progress Bar */
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--monday-light);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--gradient-green);
  transition: width 0.3s ease;
}

/* Responsive Design */
@media (max-width: 768px) {
  .financial-metric {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .kpi-grid {
    gap: 1rem;
  }
  
  .industry-item,
  .client-metric {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
}
</style>