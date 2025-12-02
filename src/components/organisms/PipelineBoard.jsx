import React, { useEffect, useState } from "react";
import { dealService } from "@/services/api/dealService";
import { stageService } from "@/services/api/stageService";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";
import { getAll as getAllCompanies, update as updateCompany } from "@/services/api/companyService";
import { getAll as getAllQuotes, update as updateQuote } from "@/services/api/quoteService";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import PipelineColumn from "@/components/molecules/PipelineColumn";

const PipelineBoard = ({ onEditDeal, onViewDeal, onAddDeal }) => {
  const [stages, setStages] = useState([]);
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [stagesData, dealsData, contactsData] = await Promise.all([
          stageService.getAll(),
          dealService.getAll(),
          contactService.getAll()
        ]);
        setStages(stagesData);
        setDeals(dealsData);
        setContacts(contactsData);
      } catch (err) {
        console.error('Error loading pipeline data:', err);
        setError("Failed to load pipeline data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDealMove = async (dealId, newStageId) => {
    try {
      await dealService.update(dealId, { stage_c: newStageId });
      const updatedDeals = await dealService.getAll();
      setDeals(updatedDeals);
      toast.success("Deal moved successfully!");
    } catch (error) {
      console.error('Error moving deal:', error);
      setError(error.message);
      toast.error("Failed to move deal. Please try again.");
    }
  };

  const handleDragEnd = async (dealId, newStage) => {
    try {
      await dealService.updateStage(dealId, newStage);
      const updatedDeals = await dealService.getAll();
      setDeals(updatedDeals);
      toast.success("Deal moved successfully!");
    } catch (err) {
      console.error('Error moving deal:', err);
      setError("Failed to move deal");
      toast.error("Failed to move deal. Please try again.");
    }
  };

  const getDealsForStage = (stageId) => {
    return deals.filter(deal => deal.stage_c?.Id === stageId || deal.stage_c === stageId);
  };

  const getTotalValue = (stageId) => {
    return getDealsForStage(stageId).reduce((sum, deal) => sum + (deal.value_c || 0), 0);
  };

  const getDealsByStage = (stageName) => {
    return deals.filter(deal => deal.stage === stageName.toLowerCase());
  };

  const getContactById = (contactId) => {
    return contacts.find(contact => contact.Id === contactId);
  };

  const calculateStageTotal = (stageName) => {
    const stageDeals = getDealsByStage(stageName);
    return stageDeals.reduce((total, deal) => total + (deal.value || 0), 0);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={() => window.location.reload()} />;
  if (deals.length === 0) {
    return (
      <Empty
        title="No deals in your pipeline"
        description="Start building your sales pipeline by adding your first deal"
        action={onAddDeal}
        actionLabel="Add First Deal"
        icon="Target"
      />
    );
  }

  return (
    <div className="h-full">
      <div className="flex gap-6 overflow-x-auto pb-4 min-h-[600px]">
        {stages.map((stage) => (
          <PipelineColumn
            key={stage.Id}
            stage={stage}
            deals={getDealsByStage(stage.name)}
            contacts={contacts}
            total={calculateStageTotal(stage.name)}
            onDragEnd={handleDragEnd}
            onEditDeal={onEditDeal}
            onViewDeal={onViewDeal}
            getContactById={getContactById}
          />
        ))}
      </div>
    </div>
  );
};

export default PipelineBoard;

export default PipelineBoard