import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  BarChart3,
  Download,
  Plus
} from 'lucide-react';
import {
  departmentsMaster,
  getEmergencyDepartments,
  getNABHComplianceStats,
  getDepartmentCategorySummary,
  exportDepartmentListForAudit,
  type DepartmentCategory,
  type DepartmentType
} from '../data/departmentsMaster';

/**
 * Departments Master Page Component
 * Displays and manages all hospital departments from scope of services
 */
const DepartmentsMasterPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DepartmentCategory | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<DepartmentType | 'All'>('All');
  const [complianceFilter, setComplianceFilter] = useState<'All' | 'Compliant' | 'Non-Compliant' | 'Under Review' | 'Not Assessed'>('All');
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);

  // Calculate statistics
  const complianceStats = getNABHComplianceStats();
  const categorySummary = getDepartmentCategorySummary();

  // Filter departments based on search and filters
  const filteredDepartments = useMemo(() => {
    let filtered = departmentsMaster;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(dept => 
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(dept => dept.category === categoryFilter);
    }

    // Type filter
    if (typeFilter !== 'All') {
      filtered = filtered.filter(dept => dept.type === typeFilter);
    }

    // Compliance filter
    if (complianceFilter !== 'All') {
      filtered = filtered.filter(dept => dept.nabhCompliance.complianceStatus === complianceFilter);
    }

    // Emergency services filter
    if (showEmergencyOnly) {
      filtered = filtered.filter(dept => dept.isEmergencyService);
    }

    return filtered;
  }, [searchTerm, categoryFilter, typeFilter, complianceFilter, showEmergencyOnly]);

  // Handle export to CSV/PDF
  const handleExport = () => {
    const exportData = exportDepartmentListForAudit();
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Code,Name,Category,Type,Emergency Service,Operating Hours,Compliance Status,Services\n" +
      exportData.map(dept => 
        `"${dept.code}","${dept.name}","${dept.category}","${dept.type}","${dept.isEmergencyService}","${dept.operatingHours}","${dept.complianceStatus}","${dept.services}"`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `departments_master_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get compliance status color and icon
  const getComplianceDisplay = (status: string) => {
    switch (status) {
      case 'Compliant':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' };
      case 'Non-Compliant':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' };
      case 'Under Review':
        return { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-100' };
      default:
        return { icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Departments Master
            </h1>
            <p className="text-gray-600">
              Based on Scope of Services - Ayushman Nagpur Hospital (Sep 26, 2025)
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              Export for Audit
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus size={16} />
              Add Department
            </button>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Departments</p>
                <p className="text-2xl font-bold text-gray-900">{complianceStats.total}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">NABH Compliance</p>
                <p className="text-2xl font-bold text-green-600">{complianceStats.compliancePercentage}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Emergency Services</p>
                <p className="text-2xl font-bold text-red-600">{getEmergencyDepartments().length}</p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-yellow-600">{complianceStats.underReview}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Category Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            Department Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categorySummary).map(([category, count]) => (
              <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{count}</p>
                <p className="text-sm text-gray-600">{category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as DepartmentCategory | 'All')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            <option value="Clinical Speciality">Clinical Speciality</option>
            <option value="Super Speciality">Super Speciality</option>
            <option value="Support Services">Support Services</option>
            <option value="Administration">Administration</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as DepartmentType | 'All')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Types</option>
            <option value="Medical">Medical</option>
            <option value="Surgical">Surgical</option>
            <option value="Diagnostic">Diagnostic</option>
            <option value="Support">Support</option>
            <option value="Administrative">Administrative</option>
          </select>

          {/* Compliance Filter */}
          <select
            value={complianceFilter}
            onChange={(e) => setComplianceFilter(e.target.value as typeof complianceFilter)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Compliance</option>
            <option value="Compliant">Compliant</option>
            <option value="Non-Compliant">Non-Compliant</option>
            <option value="Under Review">Under Review</option>
            <option value="Not Assessed">Not Assessed</option>
          </select>

          {/* Emergency Filter */}
          <label className="flex items-center gap-2 px-3 py-2">
            <input
              type="checkbox"
              checked={showEmergencyOnly}
              onChange={(e) => setShowEmergencyOnly(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Emergency Only</span>
          </label>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <span>Showing {filteredDepartments.length} of {departmentsMaster.length} departments</span>
          {(searchTerm || categoryFilter !== 'All' || typeFilter !== 'All' || complianceFilter !== 'All' || showEmergencyOnly) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All');
                setTypeFilter('All');
                setComplianceFilter('All');
                setShowEmergencyOnly(false);
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDepartments.map((department) => {
          const complianceDisplay = getComplianceDisplay(department.nabhCompliance.complianceStatus);
          const ComplianceIcon = complianceDisplay.icon;

          return (
            <div
              key={department.id}
              className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                {/* Department Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {department.name}
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {department.code}
                      </span>
                      {department.isEmergencyService && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                          24/7
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{department.description}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${complianceDisplay.bg}`}>
                    <ComplianceIcon size={20} className={complianceDisplay.color} />
                  </div>
                </div>

                {/* Department Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Category</p>
                    <p className="text-sm text-gray-900">{department.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Type</p>
                    <p className="text-sm text-gray-900">{department.type}</p>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{department.operatingHours}</span>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Services</p>
                  <div className="flex flex-wrap gap-1">
                    {department.services.slice(0, 3).map((service, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {service}
                      </span>
                    ))}
                    {department.services.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{department.services.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Compliance Status */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${complianceDisplay.bg}`}>
                    <ComplianceIcon size={14} className={complianceDisplay.color} />
                    <span className={`text-xs font-medium ${complianceDisplay.color}`}>
                      {department.nabhCompliance.complianceStatus}
                    </span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredDepartments.length === 0 && (
        <div className="text-center py-12">
          <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
};

export default DepartmentsMasterPage;