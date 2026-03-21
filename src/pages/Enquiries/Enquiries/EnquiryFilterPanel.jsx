import React, { useState, useEffect } from 'react';
import { ChevronLeft, WindArrowDown } from 'lucide-react';
import { serviceInstance } from '../../../axiosinstance';
import { getSession } from '../../../getSession';
import { FaStreetView } from 'react-icons/fa';
// onPageChange should be passed as a prop from parent, not imported
const COLUMNS = [
  { key: 'PersonName', label: 'Name', placeholder: 'Enter name', type: 'v' },
  { key: 'Company', label: 'Company', placeholder: 'Company name', type: 'v' },
  { key: 'CsvMobileNo', label: 'Mobile', placeholder: 'Do not add +91', type: 'v' },
  { key: 'CsvEmailId', label: 'Email', placeholder: 'Email', type: 'v' },
  { key: 'City', label: 'City', placeholder: 'City', type: 'v' },
  { key: 'State', label: 'State', placeholder: 'State', type: 'v' },
  { key: 'Country', label: 'Country', placeholder: 'Country', type: 'v' },
  { key: 'Pincode', label: 'Pin code', placeholder: 'Pin code', type: 'v' },
  { key: 'Address', label: 'Address', placeholder: 'Address', type: 'v' },
  { key: 'LeadNo', label: 'Lead No', placeholder: 'Enter number', type: 'f' },
  { key: 'FollowupDate', label: 'Followup Date', placeholder: 'Select date', type: 'd' }
];

const EnquiryFilterPanel = ({
  show = false,
  onClose = () => {},
  initialFilters = {},
  onApply = () => {},
  setFilterExpSQLClause = () => {},
  onPageChange = () => {},
  setviewMode = () => {},
}) => {

  const [local, setLocal] = useState({});
  const [customFields, setCustomFields] = useState([]);
  const [allColumns, setAllColumns] = useState([]);

  // Fetch custom fields from API
  useEffect(() => {
    const fetchCustomFields = async () => {
      try {
        const session = getSession();
        const payload = {
          Token: session.token || session.TokenId,
          Details: JSON.stringify({
            ParentId: session.parentId , // Enquiry parent ID (1 for Enquiry, 2 for Lead)
            FieldId: 0,
            IsMandatory: -1,
            IsQuickAdd: -1
          })
        };

        const response = await serviceInstance.post(
          '/Common/GetCustomFieldsByParentID',
          payload
        );

        if (response.data.Status === 1 && response.data.Details) {
          const customFieldsData = Array.isArray(response.data.Details) 
            ? response.data.Details 
            : JSON.parse(response.data.Details);
          
          const mappedFields = customFieldsData
            .filter(field => field.IsActive) // Only show active fields
            .map(field => {
              // Determine field type based on DataType from CustomField_BO
              let fieldType = 'v'; // default to string (varchar)
              const dataType = (field.DataType || '').toLowerCase();
              
              if (dataType === 'numeric' || dataType === 'int' || dataType === 'decimal' || dataType === 'float' || dataType === 'number') {
                fieldType = 'f'; // numeric/float
              } else if (dataType === 'datetime' || dataType === 'date' || dataType === 'time') {
                fieldType = 'd'; // datetime
              } else if (dataType === 'varchar' || dataType === 'text' || dataType === 'string') {
                fieldType = 'v'; // string/varchar
              }

              return {
                key: field.FieldName || `CustomField_${field.FieldId}`,
                label: field.FieldName || `Custom Field ${field.FieldId}`,
                placeholder: field.ToolTip || `Enter ${field.FieldName || 'value'}`,
                type: fieldType,
                isCustom: true,
                fieldId: field.FieldId,
                isMandatory: field.IsMandatory,
                isQuickAdd: field.IsQuickAdd,
                defaultValue: field.DefaultValue,
                minValue: field.MinValue,
                maxValue: field.MaxValue,
                choices: field.Choices, // For dropdown/select fields
                sequence: field.Sequence
              };
            })
            .sort((a, b) => a.sequence - b.sequence); // Sort by sequence
          
          console.log('Custom fields loaded:', mappedFields);
          setCustomFields(mappedFields);
          setAllColumns([...COLUMNS, ...mappedFields]);
          //window.location.reload(); // Reload the page to reflect new columns in filter panel
          //setViewMode('table'); 
        } else {
          console.warn('No custom fields found or API returned error');
          setAllColumns(COLUMNS);
        }
      } catch (error) {
        console.error('Error fetching custom fields:', error);
        setAllColumns(COLUMNS);
      }
    };

    if (show) {
      fetchCustomFields();
    } else {
      // Reset to default columns when panel is closed
      setAllColumns(COLUMNS);
    }
  }, [show]);

  useEffect(() => {
    const base = {};
    const columnsToUse = allColumns.length > 0 ? allColumns : COLUMNS;
    
    columnsToUse.forEach(c => {
      base[c.key] = {
        checked: !!initialFilters[c.key],
        condition: c.type === 'f' ? 'equals' : c.type === 'd' ? 'between' : 'contains',
        value: initialFilters[c.key] || '',
        fromDate: '',
        toDate: '',
        type: c.type
      };
    });
    setLocal(base);
  }, [initialFilters, show, allColumns]);

  const toggleColumn = (key) => {
    setLocal(prev => ({
      ...prev,
      [key]: { ...prev[key], checked: !prev[key].checked }
    }));
  };

  const setCondition = (key, condition) => {
    setLocal(prev => ({
      ...prev,
      [key]: { ...prev[key], condition }
    }));
  };

  const setValue = (key, value) => {
    setLocal(prev => ({
      ...prev,
      [key]: { ...prev[key], value }
    }));
  };

  const setFromDate = (key, fromDate) => {
    setLocal(prev => ({
      ...prev,
      [key]: { ...prev[key], fromDate }
    }));
  };

  const setToDate = (key, toDate) => {
    setLocal(prev => ({
      ...prev,
      [key]: { ...prev[key], toDate }
    }));
  };

  // Generate SQL condition based on type and condition
  const generateSQLCondition = (key, fieldState) => {
    const { condition, value, fromDate, toDate, type } = fieldState;
    
    if (!value && !fromDate && !toDate) return null;

    // Handle string type (v)
    if (type === 'v') {
      const trimmedValue = value.trim();
      if (!trimmedValue) return null;

      switch (condition) {
        case 'contains':
          return `CAST(${key} AS VARCHAR) LIKE '%${trimmedValue}%'`;
        case 'equals':
          return `CAST(${key} AS VARCHAR) = '${trimmedValue}'`;
        case 'startswith':
          return `CAST(${key} AS VARCHAR) LIKE '${trimmedValue}%'`;
        case 'endswith':
          return `CAST(${key} AS VARCHAR) LIKE '%${trimmedValue}'`;
        default:
          return null;
      }
    }

    // Handle numeric type (f)
    if (type === 'f') {
      const numValue = value.trim();
      if (!numValue) return null;

      switch (condition) {
        case 'equals':
          return `${key} = ${numValue}`;
        case 'greaterthan':
          return `${key} > ${numValue}`;
        case 'lessthan':
          return `${key} < ${numValue}`;
        case 'greaterequal':
          return `${key} >= ${numValue}`;
        case 'lessequal':
          return `${key} <= ${numValue}`;
        default:
          return null;
      }
    }

    // Handle datetime type (d)
    if (type === 'd') {
      if (condition === 'between' && fromDate && toDate) {
        return `${key} BETWEEN '${fromDate}' AND '${toDate}'`;
      } else if (condition === 'equals' && fromDate) {
        return `CAST(${key} AS DATE) = '${fromDate}'`;
      } else if (condition === 'greaterthan' && fromDate) {
        return `${key} > '${fromDate}'`;
      } else if (condition === 'lessthan' && fromDate) {
        return `${key} < '${fromDate}'`;
      }
      return null;
    }

    return null;
  };

  // const [filters, setFilters] = useState({});
  const filters = {};
  
  const handleApply = () =>{
   // window.location.reload();

     debugger;
    console.log('Applying Filters 1:', local);
    
    const whereConditions = [];

    Object.keys(local).forEach(k => {
      if (local[k].checked) {
        const fieldState = local[k];
        
        // Store structured filter object (for backward compatibility)
        if (fieldState.type === 'd') {
          // For datetime, store both dates
          if (fieldState.fromDate || fieldState.toDate) {
            filters[k] = {
              condition: fieldState.condition,
              value: fieldState.fromDate,
              fromDate: fieldState.fromDate,
              toDate: fieldState.toDate,
              type: fieldState.type
            };
          }
        } else if (fieldState.value?.trim()) {
          // For string and numeric
          filters[k] = {
            condition: fieldState.condition,
            value: fieldState.value,
            type: fieldState.type
          };
        }

        // Generate SQL expression
        const sqlExpression = generateSQLCondition(k, fieldState);
        if (sqlExpression) {
          whereConditions.push(sqlExpression);
        }
      }
    });

    // Final WHERE clause
    const whereClause = whereConditions.length
      ? " " + whereConditions.join(" AND ")
      : "";

    setFilterExpSQLClause(whereClause);
    
    console.log('Generated SQL WHERE clause:', whereClause);
    console.log('Applying Filters 2:', filters);
  //setviewMode('card');
     onApply(filters);
      // fetchEnquiry(); // Removed to fix the error
     // Reload the page to reflect applied filters in the table view 
    //  setTimeout (() => {
    //   // window.location.reload();
    //    onApply(filters);
    //   setviewMode('table');
    //  }, 1000);
      
  //onPageChange(1);

    };

  if (!show) return null;


  return (
    <>
      <div className="fixed h-screen inset-0 bg-black bg-opacity-30 z-40" onClick={onClose} />

      <aside className="fixed inset-y-0 left-0 z-50 w-80 bg-white border-r shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0">
            <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="text-lg font-medium">Filters</h3>
          </div>

          <div className="p-4 overflow-auto flex-1">
            {(allColumns.length > 0 ? allColumns : COLUMNS).map(col => {
              const fieldState = local[col.key];
              if (!fieldState) return null;

              return (
                <div key={col.key} className="mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded-[2px]"
                      checked={fieldState?.checked || false}
                      onChange={() => toggleColumn(col.key)}
                    />
                    <span className="font-medium">{col.label}</span>
                    {col.isCustom && <span className="text-xs text-blue-500">(Custom)</span>}
                  </label>

                  {fieldState?.checked && (
                    <div className="mt-2 space-y-2">
                      {/* String type (v) */}
                      {col.type === 'v' && (
                        <>
                          <select
                            value={fieldState.condition}
                            onChange={e => setCondition(col.key, e.target.value)}
                            className="w-full px-2 py-1 border rounded text-sm"
                          >
                            <option value="contains">Contains</option>
                            <option value="equals">Equals</option>
                            <option value="startswith">Starts With</option>
                            <option value="endswith">Ends With</option>
                          </select>

                          <input
                            type="text"
                            value={fieldState.value}
                            onChange={e => setValue(col.key, e.target.value)}
                            placeholder={col.placeholder}
                            className="w-full px-2 py-2 border rounded text-sm"
                          />
                        </>
                      )}

                      {/* Numeric type (f) */}
                      {col.type === 'f' && (
                        <>
                          <select
                            value={fieldState.condition}
                            onChange={e => setCondition(col.key, e.target.value)}
                            className="w-full px-2 py-1 border rounded text-sm"
                          >
                            <option value="equals">Equals</option>
                            <option value="greaterthan">Greater Than</option>
                            <option value="lessthan">Less Than</option>
                            <option value="greaterequal">Greater or Equal</option>
                            <option value="lessequal">Less or Equal</option>
                          </select>

                          <input
                            type="number"
                            value={fieldState.value}
                            onChange={e => setValue(col.key, e.target.value)}
                            placeholder={col.placeholder}
                            className="w-full px-2 py-2 border rounded text-sm"
                          />
                        </>
                      )}

                      {/* DateTime type (d) */}
                      {col.type === 'd' && (
                        <>
                          <select
                            value={fieldState.condition}
                            onChange={e => setCondition(col.key, e.target.value)}
                            className="w-full px-2 py-1 border rounded text-sm"
                          >
                            <option value="between">Between</option>
                            <option value="equals">Equals</option>
                            <option value="greaterthan">Greater Than</option>
                            <option value="lessthan">Less Than</option>
                          </select>

                          <div className="space-y-2">
                            <input
                              type="datetime-local"
                              value={fieldState.fromDate}
                              onChange={e => setFromDate(col.key, e.target.value)}
                              placeholder="From Date"
                              className="w-full px-2 py-2 border rounded text-sm"
                            />

                            {fieldState.condition === 'between' && (
                              <input
                                type="datetime-local"
                                value={fieldState.toDate}
                                onChange={e => setToDate(col.key, e.target.value)}
                                placeholder="To Date"
                                className="w-full px-2 py-2 border rounded text-sm"
                              />
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex-shrink-0 border-t bg-white p-4">
            <div className="flex items-center gap-2 justify-end">
              <button type="submit" onClick={() => { handleApply(); onPageChange(1); }} className="bg-green-500 text-white px-4 py-2 rounded">
                Apply
              </button>
              <button onClick={onClose} className="bg-gray-100 px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default EnquiryFilterPanel;
