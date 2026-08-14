'use client'

import { useState, useEffect } from 'react'
import { X, Database, Users, Package, Receipt, Calendar, Download } from 'lucide-react'

export default function BackupViewer({ licenseKey, shopName, onClose }) {
  const [loading, setLoading] = useState(false)
  const [backups, setBackups] = useState([])
  const [selectedBackup, setSelectedBackup] = useState(null)
  const [viewingData, setViewingData] = useState(false)

  const loadBackups = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/backup/list?license_key=${licenseKey}`)
      const data = await res.json()
      if (data.success) {
        setBackups(data.backups)
      }
    } catch (error) {
      console.error('Failed to load backups:', error)
    } finally {
      setLoading(false)
    }
  }

  const viewBackupData = async (backupId) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/backup/details?backup_id=${backupId}`)
      const data = await res.json()
      if (data.success) {
        setSelectedBackup(data.backup)
        setViewingData(true)
      }
    } catch (error) {
      console.error('Failed to load backup details:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadBackup = (backup) => {
    const dataStr = JSON.stringify(backup, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `backup-${backup.shop_name}-${backup.backup_date}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    loadBackups()
  }, [])

  if (viewingData && selectedBackup) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Backup Data</h2>
              <p className="text-sm text-gray-600 mt-1">{selectedBackup.shop_name} - {new Date(selectedBackup.backup_date).toLocaleString()}</p>
            </div>
            <button
              onClick={() => setViewingData(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Show restaurant stats if available, otherwise show retail stats */}
              {selectedBackup.stats?.total_orders !== undefined ? (
                <>
                  {/* Restaurant Stats */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                      <Receipt size={20} />
                      <span className="font-semibold">Orders</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-900">{selectedBackup.stats?.total_orders || 0}</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <Receipt size={20} />
                      <span className="font-semibold">Bills</span>
                    </div>
                    <div className="text-3xl font-bold text-green-900">{selectedBackup.stats?.total_bills || 0}</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-purple-700 mb-2">
                      <Users size={20} />
                      <span className="font-semibold">Customers</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-900">{selectedBackup.stats?.total_customers || 0}</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-orange-700 mb-2">
                      <Database size={20} />
                      <span className="font-semibold">Tables</span>
                    </div>
                    <div className="text-3xl font-bold text-orange-900">{selectedBackup.stats?.total_tables || 0}</div>
                  </div>
                </>
              ) : (
                <>
                  {/* Retail Stats */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                      <Package size={20} />
                      <span className="font-semibold">Products</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-900">{selectedBackup.stats?.total_products || 0}</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <Users size={20} />
                      <span className="font-semibold">Customers</span>
                    </div>
                    <div className="text-3xl font-bold text-green-900">{selectedBackup.stats?.total_customers || 0}</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-purple-700 mb-2">
                      <Receipt size={20} />
                      <span className="font-semibold">Transactions</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-900">{selectedBackup.stats?.total_transactions || 0}</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-orange-700 mb-2">
                      <Database size={20} />
                      <span className="font-semibold">Size</span>
                    </div>
                    <div className="text-3xl font-bold text-orange-900">{selectedBackup.size_kb} KB</div>
                  </div>
                </>
              )}
            </div>

            {/* Data Tables or Info Message */}
            {!selectedBackup.data || Object.keys(selectedBackup.data).length === 0 ? (
              <div className="space-y-6">
                {/* Success Banner */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-4 rounded-full">
                      <Database size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1">✓ Backup Successfully Uploaded</h3>
                      <p className="text-green-50">Your data has been securely stored in the cloud</p>
                    </div>
                  </div>
                </div>

                {/* Backup Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="text-blue-600" size={24} />
                      <h4 className="font-bold text-gray-900">Backup Details</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Backup Date:</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(selectedBackup.backup_date).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Uploaded:</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(selectedBackup.uploaded_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Backup Size:</span>
                        <span className="font-bold text-blue-600">{selectedBackup.size_kb} KB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">License Key:</span>
                        <span className="font-mono text-xs text-gray-900">{selectedBackup.license_key}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Database className="text-purple-600" size={24} />
                      <h4 className="font-bold text-gray-900">What's Included</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Complete product catalog with pricing & stock levels</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Customer database with contact information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Transaction history (last 90 days)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Held bills and credit payments</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>User accounts and system settings</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Data Summary Cards */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">📊 Backup Contents Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-md">
                      <Package size={24} className="mb-2 opacity-80" />
                      <div className="text-3xl font-bold mb-1">{selectedBackup.data_summary?.products_count || selectedBackup.stats?.total_products || 0}</div>
                      <div className="text-xs uppercase tracking-wide opacity-90">Products</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4 shadow-md">
                      <Users size={24} className="mb-2 opacity-80" />
                      <div className="text-3xl font-bold mb-1">{selectedBackup.data_summary?.customers_count || selectedBackup.stats?.total_customers || 0}</div>
                      <div className="text-xs uppercase tracking-wide opacity-90">Customers</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-4 shadow-md">
                      <Receipt size={24} className="mb-2 opacity-80" />
                      <div className="text-3xl font-bold mb-1">{selectedBackup.data_summary?.transactions_count || selectedBackup.stats?.total_transactions || 0}</div>
                      <div className="text-xs uppercase tracking-wide opacity-90">Transactions</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-4 shadow-md">
                      <Calendar size={24} className="mb-2 opacity-80" />
                      <div className="text-3xl font-bold mb-1">{selectedBackup.data_summary?.held_bills_count || selectedBackup.stats?.total_held_bills || 0}</div>
                      <div className="text-xs uppercase tracking-wide opacity-90">Held Bills</div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-lg p-4 shadow-md">
                      <Users size={24} className="mb-2 opacity-80" />
                      <div className="text-3xl font-bold mb-1">{selectedBackup.data_summary?.users_count || 0}</div>
                      <div className="text-xs uppercase tracking-wide opacity-90">Users</div>
                    </div>
                  </div>
                </div>

                {/* Info Notice */}
                <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="text-amber-600 mt-0.5">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-semibold text-amber-900 mb-1">Important Information</h5>
                      <p className="text-sm text-amber-800 leading-relaxed">
                        Due to cloud storage size limitations, detailed table views are not available in the admin panel. 
                        To access and inspect the complete backup data, please use the <strong>"Download Backup"</strong> button 
                        from the POS System Settings page. This will provide you with a full JSON export containing all records.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
              {/* Products */}
              {selectedBackup.data?.products?.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Package size={20} />
                    Products ({selectedBackup.data.products.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold">ID</th>
                          <th className="px-4 py-2 text-left font-semibold">Name</th>
                          <th className="px-4 py-2 text-left font-semibold">Barcode</th>
                          <th className="px-4 py-2 text-left font-semibold">Price</th>
                          <th className="px-4 py-2 text-left font-semibold">Stock</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {selectedBackup.data.products.slice(0, 10).map((product) => (
                          <tr key={product.id} className="border-b border-gray-100">
                            <td className="px-4 py-2">{product.id}</td>
                            <td className="px-4 py-2 font-medium">{product.name}</td>
                            <td className="px-4 py-2 font-mono text-xs">{product.barcode || 'N/A'}</td>
                            <td className="px-4 py-2">NPR {product.price}</td>
                            <td className="px-4 py-2">{product.stock}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {selectedBackup.data.products.length > 10 && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Showing 10 of {selectedBackup.data.products.length} products
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Customers */}
              {selectedBackup.data?.customers?.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Users size={20} />
                    Customers ({selectedBackup.data.customers.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold">ID</th>
                          <th className="px-4 py-2 text-left font-semibold">Name</th>
                          <th className="px-4 py-2 text-left font-semibold">Phone</th>
                          <th className="px-4 py-2 text-left font-semibold">Credit Balance</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {selectedBackup.data.customers.slice(0, 10).map((customer) => (
                          <tr key={customer.id} className="border-b border-gray-100">
                            <td className="px-4 py-2">{customer.id}</td>
                            <td className="px-4 py-2 font-medium">{customer.name}</td>
                            <td className="px-4 py-2">{customer.phone}</td>
                            <td className="px-4 py-2">NPR {customer.credit_balance || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {selectedBackup.data.customers.length > 10 && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Showing 10 of {selectedBackup.data.customers.length} customers
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Transactions */}
              {selectedBackup.data?.transactions?.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Receipt size={20} />
                    Recent Transactions ({selectedBackup.data.transactions.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold">ID</th>
                          <th className="px-4 py-2 text-left font-semibold">Date</th>
                          <th className="px-4 py-2 text-left font-semibold">Total</th>
                          <th className="px-4 py-2 text-left font-semibold">Payment Method</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {selectedBackup.data.transactions.slice(0, 10).map((transaction) => (
                          <tr key={transaction.id} className="border-b border-gray-100">
                            <td className="px-4 py-2">{transaction.id}</td>
                            <td className="px-4 py-2">{new Date(transaction.created_at).toLocaleDateString()}</td>
                            <td className="px-4 py-2 font-semibold">NPR {transaction.final_total || transaction.total || 0}</td>
                            <td className="px-4 py-2">{transaction.payment_method}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {selectedBackup.data.transactions.length > 10 && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Showing 10 of {selectedBackup.data.transactions.length} transactions
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end">
            <button
              onClick={() => setViewingData(false)}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Cloud Backups</h2>
            <p className="text-sm opacity-90 mt-1">{shopName} - {licenseKey}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">Loading backups...</p>
              </div>
            </div>
          ) : backups.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Database size={64} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-semibold">No backups found</p>
                <p className="text-gray-500 text-sm mt-2">This store hasn't created any cloud backups yet</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {backups.map((backup) => (
                <div key={backup.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="text-blue-600" size={20} />
                        <span className="text-lg font-bold text-gray-900">
                          {new Date(backup.backup_date).toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {backup.stats?.total_orders !== undefined ? (
                          <>
                            {/* Restaurant backup stats */}
                            <div>
                              <span className="text-gray-500">Orders:</span>
                              <span className="ml-2 font-semibold">{backup.stats?.total_orders || 0}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Bills:</span>
                              <span className="ml-2 font-semibold">{backup.stats?.total_bills || 0}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Customers:</span>
                              <span className="ml-2 font-semibold">{backup.stats?.total_customers || 0}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Size:</span>
                              <span className="ml-2 font-semibold">{backup.size_kb} KB</span>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Retail backup stats */}
                            <div>
                              <span className="text-gray-500">Products:</span>
                              <span className="ml-2 font-semibold">{backup.stats?.total_products || 0}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Customers:</span>
                              <span className="ml-2 font-semibold">{backup.stats?.total_customers || 0}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Transactions:</span>
                              <span className="ml-2 font-semibold">{backup.stats?.total_transactions || 0}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Size:</span>
                              <span className="ml-2 font-semibold">{backup.size_kb} KB</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => viewBackupData(backup.id)}
                      className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2"
                    >
                      <Database size={18} />
                      View Data
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
