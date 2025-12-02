import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { create as createCompany, getAll as getAllCompanies, update as updateCompany } from "@/services/api/companyService";
import { create as createQuote, getAll as getAllQuotes, update as updateQuote } from "@/services/api/quoteService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ContactDetailModal from "@/components/organisms/ContactDetailModal";
import AddContactModal from "@/components/organisms/AddContactModal";
import AddDealModal from "@/components/organisms/AddDealModal";
import SearchBar from "@/components/molecules/SearchBar";
import ContactTable from "@/components/molecules/ContactTable";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [viewingContact, setViewingContact] = useState(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddDeal, setShowAddDeal] = useState(false);

  const filteredContacts = useMemo(() => {
    if (!searchQuery) return contacts;
    const query = searchQuery.toLowerCase();
    return contacts.filter(contact => 
      contact.name?.toLowerCase().includes(query) ||
      contact.email?.toLowerCase().includes(query) ||
      contact.company?.toLowerCase().includes(query)
    );
  }, [contacts, searchQuery]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [contactsData, dealsData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll()
      ]);
      
      setContacts(contactsData || []);
      setDeals(dealsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const data = await contactService.getAll();
      setContacts(data || []);
      setError(null);
    } catch (error) {
      console.error('Error loading contacts:', error);
      setError(error.message || 'Failed to load contacts');
    }
  };

  const handleAddContact = () => {
    setShowAddContact(true);
  };

  const handleUpdateContact = async (contactId, contactData) => {
    try {
      await contactService.update(contactId, contactData);
      await loadContacts();
      setSelectedContact(null);
      toast.success('Contact updated successfully!');
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact');
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await contactService.delete(contactId);
      await loadContacts();
      setSelectedContact(null);
      toast.success('Contact deleted successfully!');
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setViewingContact(contact);
  };

  const handleViewContact = (contact) => {
    setViewingContact(contact);
  };

  const handleAddDeal = (contact) => {
    setSelectedContact(contact);
    setShowAddDeal(true);
  };

  const handleSuccess = () => {
    loadData();
  };

  const handleCloseDealModal = () => {
    setShowAddDeal(false);
    setSelectedContact(null);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-500">Contacts</h1>
          <p className="text-gray-600 mt-1">Manage your customer relationships</p>
        </div>
        <Button onClick={handleAddContact} className="flex items-center gap-2">
          <ApperIcon name="UserPlus" className="w-4 h-4" />
          Add Contact
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchBar
          placeholder="Search contacts by name, company, or email..."
          onSearch={handleSearch}
          className="w-full sm:w-96"
        />
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Users" className="w-4 h-4" />
          <span>{filteredContacts.length} contacts</span>
        </div>
      </div>

      {/* Contacts Table */}
      {filteredContacts.length === 0 ? (
        searchQuery ? (
          <div className="text-center py-12">
            <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-500">No contacts match your search criteria.</p>
          </div>
        ) : (
          <Empty
            title="No contacts yet"
            description="Start building your customer database by adding your first contact"
            action={handleAddContact}
            actionLabel="Add First Contact"
            icon="Users"
          />
        )
      ) : (
        <ContactTable
          contacts={filteredContacts}
          deals={deals}
          onEditContact={handleEditContact}
          onViewContact={handleViewContact}
          onAddDeal={handleAddDeal}
        />
      )}

      {/* Modals */}
      <AddContactModal
        isOpen={showAddContact}
        onClose={() => setShowAddContact(false)}
        onSuccess={handleSuccess}
      />

      <AddDealModal
        isOpen={showAddDeal}
        onClose={handleCloseDealModal}
        preselectedContact={selectedContact}
        onSuccess={handleSuccess}
      />

      <ContactDetailModal
        isOpen={!!viewingContact}
        onClose={() => setViewingContact(null)}
        contact={viewingContact}
        onAddDeal={(contact) => {
          setViewingContact(null);
          handleAddDeal(contact);
        }}
      />
    </div>
  );
}

export default Contacts;