import { useTranslation } from 'react-i18next';
import { Box, Typography, Stack, Divider } from '@mui/material';
import { useCurrency } from '../../../utils/currency';
import type { Project } from '../../../types/project';

interface ProjectCardCostSummaryProps {
  project: Project;
  materialCost: number;
  finishCost: number;
  sheetGoodCost: number;
  consumableCost: number;
  totalCost: number;
}

export function ProjectCardCostSummary({
  project,
  materialCost,
  finishCost,
  sheetGoodCost,
  consumableCost,
  totalCost,
}: ProjectCardCostSummaryProps) {
  const { t } = useTranslation();
  const formatCurrency = useCurrency();

  return (
    <>
      <Divider sx={{ my: 2 }} />

      {project.price > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            p: 1.5,
            mb: 2,
            bgcolor: 'rgba(59, 130, 246, 0.08)',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'rgba(59, 130, 246, 0.2)',
          }}
        >
          <Typography variant="body2" fontWeight={600} color="primary.main">
            {t('project.form.price')}
          </Typography>
          <Typography variant="body2" fontWeight={700} color="primary.main">
            {formatCurrency(project.price)}
          </Typography>
        </Box>
      )}

      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 600, display: 'block', mb: 1.5 }}
        >
          {t('projectDetails.costBreakdown')}:
        </Typography>
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {t('projects.materialsCost')}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {formatCurrency(materialCost)}
            </Typography>
          </Box>
          {finishCost > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {t('projects.finishesCost')}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatCurrency(finishCost)}
              </Typography>
            </Box>
          )}
          {sheetGoodCost > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {t('projects.sheetGoodsCost')}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatCurrency(sheetGoodCost)}
              </Typography>
            </Box>
          )}
          {consumableCost > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {t('projects.consumablesCost')}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatCurrency(consumableCost)}
              </Typography>
            </Box>
          )}
          {project.laborCost > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {t('projects.labor')}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatCurrency(project.laborCost)}
              </Typography>
            </Box>
          )}
          {project.miscCost > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {t('projects.misc')}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatCurrency(project.miscCost)}
              </Typography>
            </Box>
          )}
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              p: 1.5,
              bgcolor: 'rgba(0, 217, 36, 0.05)',
              borderRadius: 1,
            }}
          >
            <Typography variant="body1" fontWeight={700} color="text.primary">
              {t('projects.totalCost')}
            </Typography>
            <Typography variant="body1" fontWeight={700} color="success.main">
              {formatCurrency(totalCost)}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
