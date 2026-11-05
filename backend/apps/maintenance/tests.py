from datetime import date, time, timedelta
from django.test import TestCase
from django.core.exceptions import ValidationError
from apps.usine.models import Atelier, LigneProduction, Machine, CollaborateurResponsable
from apps.stock_achats.models import Piece
from apps.maintenance.models import Maintenance, ConsommationPiece

class MaintenanceStockAtomicTests(TestCase):
    def setUp(self):
        self.responsable = CollaborateurResponsable.objects.create(nom="Martin", prenom="Paul")
        self.atelier = Atelier.objects.create(numeroAtelier=1, libelle="Atelier Usinage Test", responsable=self.responsable)
        self.ligne = LigneProduction.objects.create(numeroLigne=10, nbOperateursNecessaires=4, atelier=self.atelier)
        self.machine = Machine.objects.create(referenceMachine="M-TEST-01", ligne=self.ligne)
        self.piece = Piece.objects.create(referencePiece="ROUL-01", libelle="Roulement Test", prixUnitaireHT=45.0, quantiteStock=5)
        self.maintenance = Maintenance.objects.create(
            dateDebut=date.today(),
            heureDebut=time(10, 0),
            duree=timedelta(hours=2),
            machine=self.machine
        )

    def test_stock_decremented_on_consumption(self):
        """La consommation d'une pièce doit décrémenter atomiquement le stock"""
        conso = ConsommationPiece.objects.create(
            maintenance=self.maintenance,
            piece=self.piece,
            quantiteConsommee=2
        )
        self.piece.refresh_from_db()
        self.assertEqual(self.piece.quantiteStock, 3)

    def test_insufficient_stock_raises_validation_error(self):
        """Tenter de consommer plus de pièces que le stock disponible doit lever une ValidationError"""
        with self.assertRaises(ValidationError):
            ConsommationPiece.objects.create(
                maintenance=self.maintenance,
                piece=self.piece,
                quantiteConsommee=10 # Stock disponible est 5
            )
        self.piece.refresh_from_db()
        self.assertEqual(self.piece.quantiteStock, 5) # Le stock reste intact
