import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { dealService } from "@/services/api/dealService";
import { stageService } from "@/services/api/stageService";
import { create as createCompany, getAll as getAllCompanies, update as updateCompany } from "@/services/api/companyService";
import { create as createQuote, getAll as getAllQuotes, update as updateQuote } from "@/services/api/quoteService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Button from "@/components/atoms/Button";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import AddContactModal from "@/components/organisms/AddContactModal";
import DealDetailModal from "@/components/organisms/DealDetailModal";
import AddDealModal from "@/components/organisms/AddDealModal";

export default function Pipeline() {
  const [deals, setDeals] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dealsData, stagesData] = await Promise.all([
        dealService.getAll(),
        stageService.getAll()
      ]);
      setDeals(dealsData);
      setStages(stagesData);
      setError(null);
    } catch (error) {
      console.error('Error loading pipeline data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeal = async (dealData) => {
    try {
      await dealService.create(dealData);
      await loadData();
      setIsAddModalOpen(false);
      toast.success('Deal created successfully!');
    } catch (error) {
      console.error('Error creating deal:', error);
      toast.error('Failed to create deal');
    }
  };

  const handleUpdateDeal = async (dealId, dealData) => {
    try {
      await dealService.update(dealId, dealData);
      await loadData();
      setSelectedDeal(null);
      toast.success('Deal updated successfully!');
    } catch (error) {
      console.error('Error updating deal:', error);
      toast.error('Failed to update deal');
    }
  };

  const handleDeleteDeal = async (dealId) => {
    try {
      await dealService.delete(dealId);
      await loadData();
      setSelectedDeal(null);
      toast.success('Deal deleted successfully!');
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast.error('Failed to delete deal');
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
        
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Deal</span>
        </Button>
      </div>

      <PipelineBoard 
        deals={deals}
        stages={stages}
        onDealClick={setSelectedDeal}
      />

      {isAddModalOpen && (
        <AddDealModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddDeal}
        />
      )}

      {selectedDeal && (
        <DealDetailModal
          deal={selectedDeal}
          isOpen={!!selectedDeal}
          onClose={() => setSelectedDeal(null)}
          onUpdate={handleUpdateDeal}
          onDelete={handleDeleteDeal}
        />
      )}
    </div>
  );
}